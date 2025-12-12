import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, vi } from "vitest"
import App from "./App"

// Chrome API の型を interface で定義して分かりやすくする
interface ChromeRuntimeMock {
  sendMessage: (message: { command: string }) => void
}

interface ChromeMock {
  runtime?: ChromeRuntimeMock
}

interface ChromeGlobal {
  chrome?: ChromeMock
}

afterEach(() => {
  // テストごとにモックを初期化して他のテストへの影響を防ぐ
  vi.restoreAllMocks()
  delete (globalThis as ChromeGlobal).chrome
})

// HUD のフレームだけ描画されているかをテストする
test("HUD のフレームが描画されている", () => {
  render(<App />)

  const frame = screen.getByTestId("hud-frame")
  expect(frame).toBeInTheDocument()
})

// すべてのショートカットボタンが表示されていることをチェックする
test("ショートカットボタンが全て描画されている", () => {
  render(<App />)

  const shortcutButtons = screen.getAllByRole("button")
  expect(shortcutButtons).toHaveLength(2)
  expect(screen.getByText("Ctrl + Shift + Y")).toBeInTheDocument()
  expect(screen.getByText("Ctrl + Shift + V")).toBeInTheDocument()
})

// Chrome API が無いときでもクリックでエラーが出ないことを確認する
test("Chrome API が無い環境でも安全にクリックできる", async () => {
  const user = userEvent.setup()
  render(<App />)

  const resetButton = screen.getByRole("button", { name: /ハードリセット/ })

  await expect(user.click(resetButton)).resolves.not.toThrow()
  expect((globalThis as ChromeGlobal).chrome).toBeUndefined()
})

// Chrome API があるときに正しくメッセージを送ることを確認する
test("Chrome API 経由でショートカットの命令が送信される", async () => {
  const user = userEvent.setup()
  const sendMessageMock = vi.fn()
  ;(globalThis as ChromeGlobal).chrome = {
    // runtime に sendMessage がある想定のモックを用意
    runtime: {
      sendMessage: sendMessageMock,
    },
  }

  render(<App />)

  const resetButton = screen.getByRole("button", { name: /ハードリセット/ })
  await user.click(resetButton)

  expect(sendMessageMock).toHaveBeenCalledWith({ command: "hard-reset" })
})
