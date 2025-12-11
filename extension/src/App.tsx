function App() {
  return (
    <main className="flex h-full w-full items-center justify-center bg-slate-950">
      <div className="h-[360px] w-[360px] rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/60">
          <div className="flex h-full flex-col justify-start gap-2 px-6 py-6" data-testid="hud-frame">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-slate-400">shortcut</p>
              <p className="mt-1 text-sm text-slate-400">３アクションを下へ羅列</p>
            </div>
            <div className="flex flex-1 flex-col justify-between gap-2">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-500/60 to-slate-900/60 px-3 py-3 text-white shadow shadow-indigo-500/40">
              <span className="block text-sm font-semibold tracking-widest">Ctrl + Shift + R</span>
              <span className="block text-xs uppercase tracking-[0.5em] text-slate-300">ハードリセット</span>
            </div>
            <div className="rounded-2xl bg-gradient-to-r from-sky-500/60 to-slate-900/60 px-3 py-3 text-white shadow shadow-sky-500/40">
              <span className="block text-sm font-semibold tracking-widest">Ctrl + Shift + C</span>
              <span className="block text-xs uppercase tracking-[0.5em] text-slate-300">console 表示</span>
            </div>
            <div className="rounded-2xl bg-gradient-to-r from-emerald-500/60 to-slate-900/60 px-3 py-3 text-white shadow shadow-emerald-500/40">
              <span className="block text-sm font-semibold tracking-widest">Ctrl + Shift + L</span>
              <span className="block text-xs uppercase tracking-[0.5em] text-slate-300">localStorage 表示</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
