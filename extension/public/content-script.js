(() => {
  const MAX_HISTORY = 24;
  const AUTO_HIDE_MS = 4500;
  const CONSOLE_METHODS = ["log", "info", "warn", "error"];
  const consoleHistory = [];
  let hideTimerId = 0;
  let overlayAttached = false;

  const overlay = document.createElement("div");
  overlay.style.cssText = [
    "position:fixed",
    "top:24px",
    "right:24px",
    "width:320px",
    "max-height:70vh",
    "padding:12px",
    "border-radius:24px",
    "background:linear-gradient(135deg, rgba(15,23,42,0.95), rgba(79,70,229,0.65))",
    "border:1px solid rgba(148,163,184,0.4)",
    "box-shadow:0 20px 40px rgba(15,23,42,0.6)",
    "color:#f8fafc",
    "font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
    "font-size:13px",
    "line-height:1.4",
    "pointer-events:none",
    "opacity:0",
    "transition:opacity 0.2s ease",
    "z-index:2147483647",
    "overflow:hidden",
    "backdrop-filter:blur(20px)",
  ].join(";");
  overlay.hidden = true;

  const contentContainer = document.createElement("div");
  contentContainer.style.cssText = [
    "display:flex",
    "flex-direction:column",
    "gap:8px",
    "max-height:66vh",
    "overflow-y:auto",
    "padding-right:6px",
    "scrollbar-width:none",
  ].join(";");
  overlay.appendChild(contentContainer);

  /**
   * HTML特殊文字を安全に表示用にエスケープする
   * @param {string} value
   * @returns {string}
   */
  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (char) => {
      switch (char) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#39;";
        default:
          return char;
      }
    });
  }

  /**
   * ログ引数を文字列に変換して保存する
   * @param {*} value
   * @returns {string}
   */
  function serializeArgument(value) {
    if (typeof value === "string") {
      return value;
    }
    if (
      value === null
      || typeof value === "undefined"
      || typeof value === "number"
      || typeof value === "boolean"
    ) {
      return String(value);
    }
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  /**
   * コンソール履歴を管理して最大件数までキープする
   * @param {string} level
   * @param {Array<*>} args
   */
  function pushConsoleHistory(level, args) {
    const formatted = args.map(serializeArgument).join(" ");
    consoleHistory.unshift({
      level,
      message: formatted,
      timestamp: new Date(),
    });
    if (consoleHistory.length > MAX_HISTORY) {
      consoleHistory.pop();
    }
  }

  const originalConsole = {};
  CONSOLE_METHODS.forEach((method) => {
    originalConsole[method] = console[method].bind(console);
    console[method] = (...args) => {
      pushConsoleHistory(method, args);
      originalConsole[method](...args);
    };
  });

  /**
   * オーバーレイを DOM に追加する
   */
  function attachOverlay() {
    if (overlayAttached) {
      return;
    }
    if (document.body) {
      document.body.appendChild(overlay);
      overlayAttached = true;
      return;
    }
    document.addEventListener("DOMContentLoaded", () => {
      if (!overlayAttached && document.body) {
        document.body.appendChild(overlay);
        overlayAttached = true;
      }
    });
  }

  /**
   * オーバーレイを表示するヘルパー
   * @param {string} title
   * @param {string} contentHtml
   */
  function showPanel(title, contentHtml) {
    const timestamp = new Date().toLocaleTimeString();
    contentContainer.innerHTML = [
      `<div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">`,
      `<span style="letter-spacing:0.15em; font-size:0.7rem; font-weight:700;">${escapeHtml(title)}</span>`,
      `<span style="font-size:0.65rem; color:rgba(226,232,240,0.75);">${escapeHtml(timestamp)}</span>`,
      `</div>`,
      `<div style="display:flex; flex-direction:column; gap:6px; width:100%;">${contentHtml}</div>`,
    ].join("");
    overlay.hidden = false;
    overlay.style.opacity = "1";
    if (hideTimerId) {
      window.clearTimeout(hideTimerId);
    }
    hideTimerId = window.setTimeout(() => {
      overlay.style.opacity = "0";
      window.setTimeout(() => {
        overlay.hidden = true;
      }, 200);
    }, AUTO_HIDE_MS);
  }

  /**
   * コンソール履歴をオーバーレイに整形する
   * @returns {string}
   */
  function renderConsoleContent() {
    if (!consoleHistory.length) {
      return '<p style="color:rgba(226,232,240,0.6); font-size:0.75rem;">Console に記録がありません</p>';
    }
    const entries = consoleHistory.slice(0, 10);
    return entries
      .map((entry) => {
        const indicatorColors = {
          log: "rgba(59,130,246,0.8)",
          info: "rgba(6,182,212,0.8)",
          warn: "rgba(251,191,36,0.8)",
          error: "rgba(248,113,113,0.9)",
        };
        const badgeColor = indicatorColors[entry.level] ?? "rgba(148,163,184,0.8)";
        return [
          `<div style="display:flex; flex-direction:column; gap:2px; padding:6px 8px; border-radius:12px; background:rgba(15,23,42,0.5); border:1px solid rgba(148,163,184,0.3);">`,
          `<div style="display:flex; justify-content:space-between; font-size:0.7rem; color:rgba(148,163,184,0.9);">`,
          `<span style="display:inline-flex; align-items:center; gap:4px;">`,
          `<span style="width:8px; height:8px; border-radius:9999px; background:${badgeColor};"></span>`,
          `<strong>${escapeHtml(entry.level.toUpperCase())}</strong>`,
          `</span>`,
          `<span>${escapeHtml(entry.timestamp.toLocaleTimeString())}</span>`,
          `</div>`,
          `<p style="margin:0; font-size:0.85rem; white-space:pre-wrap; overflow-wrap:break-word;">${escapeHtml(entry.message)}</p>`,
          `</div>`,
        ].join("");
      })
      .join("");
  }

  /**
   * localStorage の内容をオーバーレイに整形する
   * @returns {string}
   */
  function renderStorageContent() {
    let entries = [];
    try {
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (!key) {
          continue;
        }
        const value = window.localStorage.getItem(key);
        entries.push({ key, value });
      }
    } catch {
      return '<p style="color:rgba(248,113,113,0.9); font-size:0.75rem;">localStorage にアクセスできません</p>';
    }
    if (!entries.length) {
      return '<p style="color:rgba(226,232,240,0.6); font-size:0.75rem;">localStorage にデータはありません</p>';
    }
    return entries
      .map((pair) => {
        return [
          `<div style="padding:6px 8px; border-radius:10px; background:rgba(15,23,42,0.4); border:1px solid rgba(148,163,184,0.3); font-size:0.8rem;">`,
          `<strong>${escapeHtml(pair.key)}</strong>`,
          `<p style="margin:2px 0 0; font-size:0.75rem; color:rgba(226,232,240,0.85); white-space:pre-wrap; overflow-wrap:break-word;">${escapeHtml(pair.value ?? "null")}</p>`,
          `</div>`,
        ].join("");
      })
      .join("");
  }

  /**
   * コンソールパネル表示を受け取ったときの処理
   */
  function handleShowConsole() {
    showPanel("console 表示", renderConsoleContent());
  }

  /**
   * localStorage パネル表示を受け取ったときの処理
   */
  function handleShowLocalStorage() {
    showPanel("localStorage 表示", renderStorageContent());
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (!message || typeof message.type !== "string") {
      return;
    }
    if (message.type === "SHOW_CONSOLE_PANEL") {
      handleShowConsole();
      return;
    }
    if (message.type === "SHOW_LOCALSTORAGE_PANEL") {
      handleShowLocalStorage();
    }
  });

  attachOverlay();
})();
