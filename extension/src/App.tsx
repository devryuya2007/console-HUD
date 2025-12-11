import ConsoleAction from "./components/ConsoleAction"
import HardResetAction from "./components/HardResetAction"
import StorageAction from "./components/StorageAction"

function App() {
  return (
    <main className="flex h-full w-full items-center justify-center bg-slate-950">
      <div className="h-[360px] w-[360px] rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/60">
        <div className="flex h-full flex-col gap-3 px-6 py-6" data-testid="hud-frame">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-slate-400">shortcut</p>
            <p className="mt-1 text-sm text-slate-400">３アクションを下へ羅列</p>
          </div>
          <div className="flex flex-1 flex-col justify-between gap-2">
            <HardResetAction />
            <ConsoleAction />
            <StorageAction />
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
