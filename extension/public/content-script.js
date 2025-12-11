(() => {
  const PANEL_CONSOLE = "console";
  const PANEL_STORAGE = "storage";
  const MAX_LOG_HISTORY = 24;
  const MAX_COMMAND_HISTORY = 8;
  const AUTO_HIDE_DELAY = 4500;
  const CONSOLE_METHODS = ["log", "info", "warn", "error"];
  const consoleHistory = [];
  const commandResults = [];
  let hideTimerId = 0;

  const overlay = document.createElement("div");
  overlay.style.cssText = [
    "position:fixed",
    "top:20px",
    "right:20px",
    "width:360px",
    "max-height:78vh",
    "padding:16px",
    "border-radius:32px",
    "background:linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,64,175,0.85))",
    "border:1px solid rgba(148,163,184,0.5)",
    "box-shadow:0 35px 65px rgba(15,23,42,0.7)",
    "color:#f8fafc",
    "font-family:system-ui,-apple-system,'Segoe UI',sans-serif",
    "font-size:13px",
    "line-height:1.4",
    "display:flex",
    "flex-direction:column",
    "gap:12px",
    "opacity:0",
    "transition:opacity 0.2s ease",
    "z-index:2147483647",
    "backdrop-filter:blur(24px)",
  ].join(";");
  overlay.hidden = true;

  const header = document.createElement("div");
  header.style.cssText = [
    "display:flex",
    "flex-direction:column",
    "gap:4px",
    "letter-spacing:0.15em",
    "font-size:0.65rem",
    "text-transform:uppercase",
    "color:rgba(148,163,184,0.8)",
  ].join(";");
  const headerTitle = document.createElement("span");
  const headerTimestamp = document.createElement("span");
  header.append(headerTitle, headerTimestamp);

  const panelBody = document.createElement("div");
  panelBody.style.cssText = [
    "display:flex",
    "flex-direction:column",
    "gap:12px",
    "overflow-y:auto",
    "max-height:66vh",
  ].join(";");

  overlay.append(header, panelBody);

  /**
   * HTML escape 用
   * @param {string} value
   * @returns {string}
   */
  const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => {
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

  /**
   * 任意の値を文字列化
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
   * コンソール履歴をキューとして管理
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
    if (consoleHistory.length > MAX_LOG_HISTORY) {
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
   * overlay を body に追加
   */
  function attachOverlay() {
    if (overlay.parentElement) {
      return;
    }
    if (document.body) {
      document.body.appendChild(overlay);
      return;
    }
    document.addEventListener("DOMContentLoaded", () => {
      if (!overlay.parentElement && document.body) {
        document.body.appendChild(overlay);
      }
    });
  }

  /**
   * overlay を非表示にする
   */
  function hideOverlay() {
    overlay.style.opacity = "0";
    window.setTimeout(() => {
      overlay.hidden = true;
    }, 200);
  }

  /**
   * overlay 再表示用タイマー
   */
  function resetHideTimer() {
    if (hideTimerId) {
      window.clearTimeout(hideTimerId);
    }
    hideTimerId = window.setTimeout(() => {
      hideOverlay();
    }, AUTO_HIDE_DELAY);
  }

  /**
   * ログをカード化して返す
   * @param {Array<typeof consoleHistory[number]>} entries
   */
  function createConsoleLogElements(entries) {
    return entries.map((entry) => {
      const card = document.createElement("div");
      card.style.cssText = [
        "display:flex",
        "flex-direction:column",
        "gap:4px",
        "padding:10px 12px",
        "border-radius:16px",
        "background:rgba(15,23,42,0.7)",
        "border:1px solid rgba(148,163,184,0.25)",
        "color:#e2e8f0",
        "font-size:0.8rem",
        "white-space:pre-wrap",
        "overflow-wrap:break-word",
      ].join(";");

      const badge = document.createElement("strong");
      badge.style.cssText = [
        "display:inline-flex",
        "gap:6px",
        "align-items:center",
        "font-size:0.7rem",
        "text-transform:uppercase",
        "letter-spacing:0.2em",
      ].join(";");
      const dot = document.createElement("span");
      dot.style.cssText = [
        "width:8px",
        "height:8px",
        "border-radius:9999px",
        "background:rgba(59,130,246,0.9)",
      ].join(";");
      const level = document.createElement("span");
      level.textContent = entry.level;
      badge.append(dot, level);

      const body = document.createElement("p");
      body.textContent = entry.message;

      const footer = document.createElement("span");
      footer.style.fontSize = "0.65rem";
      footer.style.color = "rgba(148,163,184,0.8)";
      footer.textContent = entry.timestamp.toLocaleTimeString();

      card.append(badge, body, footer);
      return card;
    });
  }

  /**
   * localStorage を列挙して構造にする
   */
  function gatherStorageEntries() {
    const entries = [];
    try {
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (!key) {
          continue;
        }
        entries.push({
          key,
          value: window.localStorage.getItem(key),
        });
      }
    } catch {
      return null;
    }
    return entries;
  }

  /**
   * localStorage の UI を生成する
   */
  function renderStoragePanel() {
    const content = document.createElement("div");
    content.style.display = "flex";
    content.style.flexDirection = "column";
    content.style.gap = "10px";

    const entries = gatherStorageEntries();
    if (entries === null) {
      const errorCard = document.createElement("div");
      errorCard.textContent = "localStorage にアクセスできません";
      errorCard.style.cssText = [
        "padding:12px",
        "border-radius:16px",
        "background:rgba(220,38,38,0.8)",
        "color:#fee2e2",
        "font-size:0.85rem",
      ].join(";");
      content.append(errorCard);
      return content;
    }

    if (!entries.length) {
      const emptyCard = document.createElement("div");
      emptyCard.style.cssText = [
        "display:flex",
        "flex-direction:column",
        "gap:6px",
        "padding:16px",
        "border-radius:20px",
        "background:linear-gradient(130deg, rgba(16,185,129,0.15), rgba(5,150,105,0.15))",
        "border:1px dashed rgba(5,150,105,0.6)",
      ].join(";");
      const title = document.createElement("strong");
      title.textContent = "localStorage は空です";
      title.style.color = "#bbf7d0";
      const description = document.createElement("p");
      description.style.margin = "0";
      description.style.fontSize = "0.8rem";
      description.textContent = "データを追加するとここにカードとして並びます。";
      emptyCard.append(title, description);
      content.append(emptyCard);
      return content;
    }

    entries.forEach((entry) => {
      const card = document.createElement("div");
      card.style.cssText = [
        "padding:12px",
        "border-radius:16px",
        "background:rgba(15,23,42,0.7)",
        "border:1px solid rgba(148,163,184,0.25)",
        "display:flex",
        "flex-direction:column",
        "gap:4px",
        "overflow-wrap:break-word",
      ].join(";");
      const label = document.createElement("span");
      label.style.color = "#7dd3fc";
      label.style.fontSize = "0.75rem";
      label.textContent = entry.key;

      const value = document.createElement("p");
      value.style.margin = "0";
      value.textContent = entry.value ?? "null";
      card.append(label, value);
      content.append(card);
    });

    return content;
  }

  /**
   * console 実行結果を HUD に記録
   * @param {string} code
   */
  function executeConsoleCode(code) {
    const trimmed = code.trim();
    if (!trimmed) {
      return;
    }
    const record = {
      code: trimmed,
      timestamp: new Date(),
      success: true,
      message: "",
    };
    try {
      const result = window.eval(trimmed);
      record.message = serializeArgument(result);
    } catch (error) {
      record.success = false;
      record.message = String(error);
    }
    commandResults.unshift(record);
    if (commandResults.length > MAX_COMMAND_HISTORY) {
      commandResults.pop();
    }
    showPanel(PANEL_CONSOLE);
  }

  /**
   * console panel を組み立てる
   */
  function renderConsolePanel() {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "12px";

    const logSection = document.createElement("div");
    logSection.style.display = "flex";
    logSection.style.flexDirection = "column";
    logSection.style.gap = "8px";

    const logEntries = createConsoleLogElements(consoleHistory.slice(0, 10));
    if (!logEntries.length) {
      const placeholder = document.createElement("span");
      placeholder.textContent = "console にログが残っていません";
      placeholder.style.color = "rgba(226,232,240,0.7)";
      placeholder.style.fontSize = "0.8rem";
      logSection.append(placeholder);
    } else {
      logEntries.forEach((item) => logSection.append(item));
    }

    const execSection = document.createElement("div");
    execSection.style.display = "flex";
    execSection.style.flexDirection = "column";
    execSection.style.gap = "8px";
    execSection.style.padding = "10px";
    execSection.style.borderRadius = "18px";
    execSection.style.background = "rgba(2,6,23,0.7)";
    execSection.style.border = "1px solid rgba(59,130,246,0.4)";

    const input = document.createElement("textarea");
    input.rows = 2;
    input.placeholder = "ここにコードを入力して Enter で実行";
    input.style.cssText = [
      "width:100%",
      "padding:8px",
      "border-radius:12px",
      "border:1px solid rgba(148,163,184,0.4)",
      "background:rgba(15,23,42,0.6)",
      "color:#f8fafc",
      "font-size:0.8rem",
      "font-family:inherit",
      "resize:vertical",
    ].join(";");

    const runButton = document.createElement("button");
    runButton.textContent = "HUD から実行";
    runButton.style.cssText = [
      "align-self:flex-end",
      "padding:6px 18px",
      "border-radius:9999px",
      "border:none",
      "background:linear-gradient(130deg, #38bdf8, #6366f1)",
      "color:#f8fafc",
      "font-size:0.75rem",
      "font-weight:700",
      "cursor:pointer",
    ].join(";");

    runButton.addEventListener("click", () => {
      executeConsoleCode(input.value);
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        executeConsoleCode(input.value);
      }
    });

    execSection.append(input, runButton);

    const resultList = document.createElement("div");
    resultList.style.display = "flex";
    resultList.style.flexDirection = "column";
    resultList.style.gap = "6px";

    if (!commandResults.length) {
      const note = document.createElement("span");
      note.textContent = "実行結果はここに表示されます";
      note.style.color = "rgba(226,232,240,0.65)";
      resultList.append(note);
    } else {
      commandResults.forEach((result) => {
        const row = document.createElement("div");
        row.style.cssText = [
          "padding:8px 10px",
          "border-radius:12px",
          "background:rgba(15,23,42,0.65)",
          "border:1px solid rgba(148,163,184,0.2)",
          "font-size:0.75rem",
          "display:flex",
          "flex-direction:column",
          "gap:4px",
        ].join(";");

        const status = document.createElement("strong");
        status.style.color = result.success ? "#34d399" : "#f87171";
        status.textContent = result.success ? "success" : "error";
        const codeLine = document.createElement("span");
        codeLine.textContent = result.code;
        const message = document.createElement("p");
        message.style.margin = "0";
        message.textContent = result.message;
        const footer = document.createElement("span");
        footer.style.color = "rgba(148,163,184,0.7)";
        footer.style.fontSize = "0.65rem";
        footer.textContent = result.timestamp.toLocaleTimeString();
        row.append(status, codeLine, message, footer);
        resultList.append(row);
      });
    }

    container.append(logSection, execSection, resultList);
    return container;
  }

  /**
   * 表示用のパネルを切り替える
   * @param {string} type
   */
  function showPanel(type) {
    headerTimestamp.textContent = new Date().toLocaleTimeString();
    panelBody.innerHTML = "";
    headerTitle.textContent = type === PANEL_STORAGE ? "localStorage" : "console";
    panelBody.append(type === PANEL_STORAGE ? renderStoragePanel() : renderConsolePanel());
    overlay.hidden = false;
    overlay.style.opacity = "1";
    resetHideTimer();
  }

  /**
   * メッセージをパネルへ橋渡し
   */
  chrome.runtime.onMessage.addListener((message) => {
    if (!message || typeof message.type !== "string") {
      return;
    }
    if (message.type === "SHOW_CONSOLE_PANEL") {
      showPanel(PANEL_CONSOLE);
      return;
    }
    if (message.type === "SHOW_LOCALSTORAGE_PANEL") {
      showPanel(PANEL_STORAGE);
    }
  });

  attachOverlay();
})();
