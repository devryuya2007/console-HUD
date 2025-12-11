export type LocalStorageEntry = {
  key: string
  value: string
}

const queryActiveTab = (): Promise<chrome.tabs.Tab | undefined> => {
  return new Promise((resolve) => {
    if (typeof chrome === "undefined" || !chrome.tabs) {
      resolve(undefined)
      return
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => resolve(tabs[0]))
  })
}

const executeScriptInTab = async <T>(tabId: number, func: () => T): Promise<T | null> => {
  if (typeof chrome === "undefined" || !chrome.scripting) {
    return null
  }
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func,
  })
  return results[0]?.result ?? null
}

const reloadTab = async (tabId: number): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof chrome === "undefined" || !chrome.tabs?.reload) {
      resolve()
      return
    }
    chrome.tabs.reload(tabId, { bypassCache: true }, () => resolve())
  })
}

const applyToActiveTab = async <T>(func: () => T): Promise<T | null> => {
  const tab = await queryActiveTab()
  if (!tab?.id) {
    return null
  }
  return executeScriptInTab(tab.id, func)
}

export const clearLocalStorageInTab = async (): Promise<boolean> => {
  await applyToActiveTab(() => {
    localStorage.clear()
    return true
  })
  return true
}

export const clearSessionStorageInTab = async (): Promise<boolean> => {
  await applyToActiveTab(() => {
    sessionStorage.clear()
    return true
  })
  return true
}

export const hardResetActiveTab = async (): Promise<void> => {
  const tab = await queryActiveTab()
  if (!tab?.id) {
    return
  }
  await executeScriptInTab(tab.id, () => {
    localStorage.clear()
    sessionStorage.clear()
    return true
  })
  await reloadTab(tab.id)
}

export const logConsoleMessage = async (message: string): Promise<string | null> => {
  return applyToActiveTab(() => {
    console.log(message)
    return message
  })
}

export const readLocalStorageEntries = async (): Promise<LocalStorageEntry[]> => {
  const payload = await applyToActiveTab(() => {
    return Object.entries(localStorage).map(([key, value]) => ({
      key,
      value: String(value),
    }))
  })
  return payload ?? []
}
