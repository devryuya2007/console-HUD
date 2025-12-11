const MESSAGE_SHOW_CONSOLE = "SHOW_CONSOLE_PANEL";
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
    return { origins: [origin] };
  }
  return { since: 0 };
}

/**
 * サイトデータを削除する Promise を返す
 * @param {string | null} origin
 * @returns {Promise<void>}
 */
function clearSiteData(origin) {
  return new Promise((resolve) => {
    const options = buildRemovalOptions(origin);
    chrome.browsingData.remove(options, DATA_TO_REMOVE, () => {
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
    // サイトデータを消去してから強制リロードする
    const origin = buildOrigin(activeTab.url);
    await clearSiteData(origin);
    chrome.tabs.reload(activeTab.id, { bypassCache: true });
    return;
  }

  if (command === "console-display") {
    postPanelMessage(activeTab.id, MESSAGE_SHOW_CONSOLE);
    return;
  }

  if (command === "localstorage-display") {
    postPanelMessage(activeTab.id, MESSAGE_SHOW_LOCAL_STORAGE);
  }
}

chrome.commands.onCommand.addListener((command) => {
  void handleCommand(command);
});
