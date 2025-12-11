import { useState } from "react"
import { logConsoleMessage } from "../services/hudActions"

export default function ConsoleAction() {
  const [status, setStatus] = useState("呼び出し待ち")

  const handleClick = async () => {
    setStatus("console へ出力中")
    const result = await logConsoleMessage("console 表示アクションが起動")
    setStatus(result ? "console に出力済み" : "結果取得に失敗")
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-2xl bg-gradient-to-r from-sky-500/70 to-slate-900/60 px-3 py-3 text-left text-white shadow-lg shadow-sky-500/40 transition hover:brightness-110"
    >
      <span className="block text-sm font-semibold tracking-widest">Ctrl + Shift + C</span>
      <span className="block text-xs uppercase tracking-[0.5em] text-slate-300">console 表示</span>
      <p className="mt-2 text-[11px] text-slate-200">{status}</p>
    </button>
  )
}
