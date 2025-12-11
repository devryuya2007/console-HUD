import { useState } from "react"
import { readLocalStorageEntries } from "../services/hudActions"

export default function StorageAction() {
  const [status, setStatus] = useState("empty")
  const [valuePreview, setValuePreview] = useState("表示待ち")

  const handleClick = async () => {
    setStatus("localStorage 読込中")
    const entries = await readLocalStorageEntries()
    if (entries.length === 0) {
      setValuePreview("empty")
      setStatus("localStorage is empty")
      return
    }
    setStatus(`${entries.length} 件取得`)
    setValuePreview(entries.slice(0, 2).map((entry) => `${entry.key}:${entry.value}`).join(" / "))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-2xl bg-gradient-to-r from-emerald-500/70 to-slate-900/60 px-3 py-3 text-left text-white shadow-lg shadow-emerald-500/40 transition hover:brightness-110"
    >
      <span className="block text-sm font-semibold tracking-widest">Ctrl + Shift + L</span>
      <span className="block text-xs uppercase tracking-[0.5em] text-slate-300">localStorage 表示</span>
      <p className="mt-2 text-[11px] text-slate-200">{status}</p>
      <p className="mt-1 text-[10px] text-slate-300">{valuePreview}</p>
    </button>
  )
}
