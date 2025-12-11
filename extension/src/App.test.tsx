import { render, screen } from "@testing-library/react"
import App from "./App"

// HUD のフレームだけ描画されているかをテストする
test("HUD のフレームが描画されている", () => {
  render(<App />)

  const frame = screen.getByTestId("hud-frame")
  expect(frame).toBeInTheDocument()
})
