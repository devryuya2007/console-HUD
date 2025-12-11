interface ShortcutCardProps {
  keyCombo: string;
  title: string;
  description: string;
  accent: string;
  gradientFrom: string;
  gradientTo: string;
}

const shortcutCards: ShortcutCardProps[] = [
  {
    keyCombo: "Ctrl + Shift + Alt + R",
    title: "ハードリセット",
    description: "localStorage / Cache / IndexedDB を消してからページを再読み込みします",
    accent: "from-indigo-500/70 to-slate-900/60",
    gradientFrom: "from-indigo-500/60",
    gradientTo: "to-slate-900/70",
  },
  {
    keyCombo: "Ctrl + Shift + Alt + C",
    title: "console 表示",
    description: "HUD がページ内にオーバーレイ表示され、console のログと実行欄が現れます",
    accent: "from-sky-500/70 to-slate-900/60",
    gradientFrom: "from-sky-500/60",
    gradientTo: "to-slate-900/70",
  },
  {
    keyCombo: "Ctrl + Shift + Alt + L",
    title: "localStorage 表示",
    description: "localStorage の中身が HUD にカード表示され、空のときも案内メッセージが出ます",
    accent: "from-emerald-500/70 to-slate-900/60",
    gradientFrom: "from-emerald-500/60",
    gradientTo: "to-slate-900/70",
  },
]

function ShortcutCard(props: ShortcutCardProps) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl bg-gradient-to-r ${props.gradientFrom} ${props.gradientTo} px-4 py-4 text-white shadow-xl shadow-slate-950/40`}
    >
      <p className="text-sm font-semibold tracking-[0.4em]">{props.keyCombo}</p>
      <p className="text-md font-bold">{props.title}</p>
      <p className="text-xs leading-relaxed text-slate-200">{props.description}</p>
    </div>
  )
}

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-6">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950/90 p-8 shadow-2xl shadow-slate-950/60">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.5em] text-slate-400">console-HUD</p>
            <h1 className="text-2xl font-semibold text-white">ショートカットで DevTools を操る</h1>
            <p className="text-sm text-slate-300">
              3 種類のホットキーを押すだけで、サービスワーカー経由で現在のページに overlay を投げてログやストレージを表示。
              他の拡張とキーが被らない構成だから、安心して HUD を呼び出せるよ。
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {shortcutCards.map((card) => (
              <ShortcutCard
                key={card.keyCombo}
                keyCombo={card.keyCombo}
                title={card.title}
                description={card.description}
                accent={card.accent}
                gradientFrom={card.gradientFrom}
                gradientTo={card.gradientTo}
              />
            ))}
          </div>
          <div className="rounded-2xl border border-slate-800/50 bg-slate-900/70 px-5 py-4 text-xs text-slate-300">
            <p className="font-semibold text-slate-100">HUD の使い方</p>
            <p>
              コンソール HUD は入力欄付きでコードを実行可能。localStorage は空でも説明付きのカードが出るので、状態確認がスムーズだよ。
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
