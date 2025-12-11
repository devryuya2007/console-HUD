import { useState } from "react"
import { hardResetActiveTab } from "../services/hudActions"

export default function HardResetAction() {
  const [status, setStatus] = useState("Click to reset")

  const handleClick = async () => {
    setStatus("処理中")
    try {
      await hardResetActiveTab()
      setStatus("local/session をクリア＋再読込")
    } catch {
      setStatus("失敗")
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-2xl bg-gradient-to-r from-indigo-500/70 to-slate-900/60 px-3 py-3 text-left text-white shadow-lg shadow-indigo-500/40 transition hover:brightness-110"
    >
      <span className="block text-sm font-semibold tracking-widest">Ctrl + Shift + R</span>
      <span className="block text-xs uppercase tracking-[0.5em] text-slate-300">ハードリセット</span>
      <p className="mt-2 text-[11px] text-slate-200">{status}</p>
    </button>
  )
}
