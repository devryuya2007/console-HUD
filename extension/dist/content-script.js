(() => {
  const MESSAGE_SHOW_LOCAL_STORAGE = "SHOW_LOCALSTORAGE_PANEL";
  let storagePanelVisible = false;

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
    "pointer-events:auto",
    "opacity:0",
    "transition:opacity 0.2s ease",
    "z-index:2147483647",
    "backdrop-filter:blur(24px)",
  ].join(";");
  overlay.hidden = true;

  const header = document.createElement("div");
  header.style.cssText = [
    "display:flex",
    "justify-content:space-between",
    "align-items:center",
    "gap:12px",
    "letter-spacing:0.15em",
    "font-size:0.65rem",
    "text-transform:uppercase",
    "color:rgba(148,163,184,0.8)",
  ].join(";");

  const headerInfo = document.createElement("div");
  headerInfo.style.cssText = [
    "display:flex",
    "flex-direction:column",
    "gap:3px",
  ].join(";");
  const headerTitle = document.createElement("span");
  const headerTimestamp = document.createElement("span");
  headerInfo.append(headerTitle, headerTimestamp);

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "✕";
  closeButton.style.cssText = [
    "width:32px",
    "height:32px",
    "border-radius:9999px",
    "border:1px solid rgba(148,163,184,0.6)",
    "background:rgba(15,23,42,0.6)",
    "color:#e2e8f0",
    "font-size:1rem",
    "cursor:pointer",
    "display:inline-flex",
    "align-items:center",
    "justify-content:center",
  ].join(";");
  closeButton.addEventListener("click", () => {
    hideOverlay();
  });

  header.append(headerInfo, closeButton);

  const panelBody = document.createElement("div");
  panelBody.style.cssText = [
    "display:flex",
    "flex-direction:column",
    "gap:12px",
    "overflow-y:auto",
    "max-height:66vh",
  ].join(";");

  overlay.append(header, panelBody);

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

  function hideOverlay() {
    overlay.style.opacity = "0";
    window.setTimeout(() => {
      overlay.hidden = true;
    }, 200);
    storagePanelVisible = false;
  }
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

  function formatStorageValue(value) {
    if (typeof value !== "string") {
      return "null";
    }
    try {
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return value;
    }
  }

  function renderStorageEntry(entry) {
    const card = document.createElement("div");
    card.style.cssText = [
      "padding:12px",
      "border-radius:16px",
      "background:rgba(15,23,42,0.7)",
      "border:1px solid rgba(148,163,184,0.25)",
      "display:flex",
      "flex-direction:column",
      "gap:8px",
      "overflow-wrap:break-word",
    ].join(";");

    const layout = document.createElement("div");
    layout.style.cssText = [
      "display:flex",
      "flex-direction:column",
      "gap:6px",
      "margin:0",
    ].join(";");

    const keyLabel = document.createElement("span");
    keyLabel.textContent = entry.key;
    keyLabel.style.cssText = [
      "margin:0",
      "font-size:0.75rem",
      "letter-spacing:0.15em",
      "opacity:0.85",
      "color:rgba(148,163,184,0.95)",
    ].join(";");

    const valueLabel = document.createElement("div");
    valueLabel.textContent = formatStorageValue(entry.value);
    valueLabel.style.cssText = [
      "margin:0",
      "font-size:0.9rem",
      "line-height:1.4",
      "color:#e0f2fe",
      "background:linear-gradient(180deg, rgba(15,23,42,0.7), rgba(30,64,175,0.4))",
      "border-radius:14px",
      "padding:12px",
      "min-height:48px",
      "overflow-wrap:anywhere",
      "white-space:pre-wrap",
      "border:1px solid rgba(59,130,246,0.25)",
      "box-shadow:0 10px 20px rgba(15,23,42,0.4)",
    ].join(";");

    layout.append(keyLabel, valueLabel);
    card.append(layout);
    return card;
  }

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
        "gap:10px",
        "padding:18px",
        "border-radius:24px",
        "background:linear-gradient(135deg, rgba(14,165,233,0.15), rgba(59,130,246,0.15))",
        "border:1px solid rgba(59,130,246,0.6)",
        "box-shadow:0 15px 30px rgba(15,23,42,0.4)",
      ].join(";");
      const badge = document.createElement("span");
      badge.textContent = "localStorage Empty";
      badge.style.cssText = [
        "align-self:flex-start",
        "padding:4px 10px",
        "border-radius:9999px",
        "font-size:0.65rem",
        "letter-spacing:0.2em",
        "text-transform:uppercase",
        "background:rgba(59,130,246,0.18)",
        "border:1px solid rgba(59,130,246,0.4)",
      ].join(";");
      const title = document.createElement("strong");
      title.textContent = "データはまだありません";
      title.style.fontSize = "1rem";
      title.style.color = "#e0f2fe";
      const description = document.createElement("p");
      description.style.margin = "0";
      description.style.color = "rgba(226,232,240,0.75)";
      description.style.fontSize = "0.85rem";
      description.textContent = "localStorage に何も登録されていないためここも空っぽになっています。";
      const hint = document.createElement("div");
      hint.style.cssText = [
        "display:flex",
        "align-items:center",
        "gap:8px",
        "padding:8px 14px",
        "border-radius:16px",
        "background:rgba(15,118,110,0.2)",
        "border:1px solid rgba(15,118,110,0.4)",
      ].join(";");
      const spark = document.createElement("span");
      spark.textContent = "✨";
      const sparkText = document.createElement("span");
      sparkText.style.color = "rgba(14,165,233,0.85)";
      sparkText.style.fontSize = "0.75rem";
      sparkText.textContent = "DevTools で localStorage に値を追加すると、ここにカードで表示されます";
      hint.append(spark, sparkText);
      emptyCard.append(badge, title, description, hint);
      content.append(emptyCard);
      return content;
    }

    entries.forEach((entry) => {
      content.append(renderStorageEntry(entry));
    });

    return content;
  }

  function showStoragePanel() {
    storagePanelVisible = true;
    headerTitle.textContent = "localStorage";
    headerTimestamp.textContent = new Date().toLocaleTimeString();
    panelBody.innerHTML = "";
    panelBody.append(renderStoragePanel());
    overlay.hidden = false;
    overlay.style.opacity = "1";
    resetHideTimer();
  }

  function toggleStoragePanel() {
    if (storagePanelVisible) {
      hideOverlay();
      return;
    }
    showStoragePanel();
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (!message || typeof message.type !== "string") {
      return;
    }
    if (message.type === MESSAGE_SHOW_LOCAL_STORAGE) {
      toggleStoragePanel();
    }
  });

  window.addEventListener("storage", () => {
    if (storagePanelVisible) {
      panelBody.innerHTML = "";
      panelBody.append(renderStoragePanel());
    }
  });

  attachOverlay();
})();
