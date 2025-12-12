interface ShortcutAction {
  command: "hard-reset" | "console-display" | "localstorage-display";
  hotkey: string;
  label: string;
  gradient: string;
  shadow: string;
}

const shortcutActions: ShortcutAction[] = [
  {
    command: "hard-reset",
    hotkey: "Ctrl + Shift + Y",
    label: "ハードリセット",
    gradient: "from-indigo-500/60 to-slate-900/60",
    shadow: "shadow-indigo-500/40",
  },
  {
    command: "console-display",
    hotkey: "Ctrl + Shift + X",
    label: "console 表示",
    gradient: "from-sky-500/60 to-slate-900/60",
    shadow: "shadow-sky-500/40",
  },
  {
    command: "localstorage-display",
    hotkey: "Ctrl + Shift + V",
    label: "localStorage 表示",
    gradient: "from-emerald-500/60 to-slate-900/60",
    shadow: "shadow-emerald-500/40",
  },
]

function App() {
  // ショートカットの命令名を service-worker 側に通知して動作を起こす
  const sendCommand = (command: ShortcutAction["command"]) => {
    if (typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
      return
    }
    chrome.runtime.sendMessage({ command })
  }

  return (
    <main className="flex h-full w-full items-center justify-center bg-slate-950">
      <div className="h-[360px] w-[360px] rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/60">
        <div className="flex h-full flex-col gap-2 px-6 py-6" data-testid="hud-frame">
          <p className="text-xs uppercase tracking-[0.5em] text-slate-400">shortcut</p>
          <div className="flex flex-1 flex-col justify-between gap-2">
            {shortcutActions.map((action) => (
              <button
                key={action.command}
                type="button"
                onClick={() => sendCommand(action.command)}
                className={`rounded-2xl bg-gradient-to-r ${action.gradient} px-3 py-3 text-left text-white shadow ${action.shadow} transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300`}
              >
                <p className="text-sm font-semibold tracking-widest">{action.hotkey}</p>
                <p className="text-xs uppercase tracking-[0.5em] text-slate-300">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
