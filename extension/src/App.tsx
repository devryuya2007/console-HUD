function App() {
  return (
    <main className="flex h-full w-full items-center justify-center bg-slate-950">
      <div className="h-[360px] w-[360px] rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/60">
        <div className="flex h-full flex-col gap-2 px-6 py-6" data-testid="hud-frame">
          <p className="text-xs uppercase tracking-[0.5em] text-slate-400">shortcut</p>
          <div className="flex flex-1 flex-col justify-between gap-2">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-500/60 to-slate-900/60 px-3 py-3 text-white shadow shadow-indigo-500/40">
              <p className="text-sm font-semibold tracking-widest">Ctrl + Shift + Alt + R</p>
              <p className="text-xs uppercase tracking-[0.5em] text-slate-300">ハードリセット</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-r from-sky-500/60 to-slate-900/60 px-3 py-3 text-white shadow shadow-sky-500/40">
              <p className="text-sm font-semibold tracking-widest">Ctrl + Shift + Alt + C</p>
              <p className="text-xs uppercase tracking-[0.5em] text-slate-300">console 表示</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500/60 to-slate-900/60 px-3 py-3 text-white shadow shadow-emerald-500/40">
              <p className="text-sm font-semibold tracking-widest">Ctrl + Shift + Alt + L</p>
              <p className="text-xs uppercase tracking-[0.5em] text-slate-300">localStorage 表示</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
