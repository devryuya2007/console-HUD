const MESSAGE_SHOW_LOCAL_STORAGE = "SHOW_LOCALSTORAGE_PANEL";

const DATA_TO_REMOVE = {
  appcache: true,
  cache: true,
  cacheStorage: true,
  cookies: true,
  downloads: true,
  fileSystems: true,
  formData: true,
  indexedDB: true,
  localStorage: true,
  pluginData: true,
  serviceWorkers: true,
  serverBoundCertificates: true,
  webSQL: true,
};
// protected / unprotected Web の両方を明示して https などの origin も確実に対象にする
const ORIGIN_TYPE_TARGETS = {
  protectedWeb: true,
  unprotectedWeb: true,
};

/**
 * アクティブなタブを取得するヘルパー
 * @returns {Promise<chrome.tabs.Tab | undefined>}
 */
function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

/**
 * 対象のタブにメッセージを送信する処理
 * @param {number} tabId
 * @param {string} messageType
 */
function postPanelMessage(tabId, messageType) {
  chrome.tabs.sendMessage(
    tabId,
    { type: messageType },
    () => {
      // コンテンツスクリプトが読み込まれていないページでは lastError が出るが、無視しておく
      if (chrome.runtime.lastError) {
        return;
      }
    },
  );
}

/**
 * URL から origin を抽出するヘルパー
 * @param {string | undefined} url
 * @returns {string | null}
 */
function buildOrigin(url) {
  if (!url) {
    return null;
  }
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

/**
 * 除去対象を絞るオプションを構築する
 * @param {string | null} origin
 * @returns {chrome.browsingData.RemovalOptions}
 */
function buildRemovalOptions(origin) {
  if (origin) {
    return {
      origins: [origin],
      originTypes: ORIGIN_TYPE_TARGETS,
    };
  }
  return {
    since: 0,
    originTypes: ORIGIN_TYPE_TARGETS,
  };
}

/**
 * サイトデータを削除する Promise を返す
 * @param {string | null} origin
 * @returns {Promise<void>}
 */
function clearSiteData(origin) {
  return new Promise((resolve, reject) => {
    const options = buildRemovalOptions(origin);
    chrome.browsingData.remove(options, DATA_TO_REMOVE, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve();
    });
  });
}

/**
 * ショートカットコマンドを受け取って処理内容を分岐する
 * @param {string} command
 */
async function handleCommand(command) {
  const activeTab = await getActiveTab();
  if (!activeTab || !activeTab.id) {
    return;
  }

  if (command === "hard-reset") {
    await performHardReset(activeTab);
    return;
  }

  if (command === "localstorage-display") {
    postPanelMessage(activeTab.id, MESSAGE_SHOW_LOCAL_STORAGE);
  }
}

/**
 * ハードリセットの実行
 * @param {chrome.tabs.Tab} tab
 */
async function performHardReset(tab) {
  const origin = buildOrigin(tab.url);
  try {
    await clearSiteData(origin);
    chrome.tabs.reload(tab.id, { bypassCache: true });
  } catch {
    // クリアできなければリロードしない
  }
}

chrome.commands.onCommand.addListener((command) => {
  void handleCommand(command);
});

chrome.runtime.onMessage.addListener((message) => {
  if (!message || typeof message.command !== "string") {
    return;
  }
  void handleCommand(message.command);
});
