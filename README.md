# console-HUD

console-HUD は、キー操作だけで localStorage や IndexedDB を調べて削除し、HUD で JSON を眺めてそのままリロードできる Chrome 拡張です。DevTools を開かずに今見ているタブのストレージを制御できるよう、service worker + shortcut で操作をつなげています。

## アプリ概要

- **目的**：`Ctrl+Shift+V` / `Ctrl+Shift+Y` という少数のショートカットで、localStorage の可視化→削除→リロードを完結させ、DevTools を開かずに軽いデバッグができるようにする。
- **主な機能**：
  1. `Ctrl+Shift+V` で localStorage をカード表示（キー上、整形済み JSON 値下）。バツや再ショートカットで閉じられる。
  2. `Ctrl+Shift+Y` でその origin の localStorage/IndexedDB を消去し、`chrome.tabs.reload` でページを再読込。
  3. service worker が `chrome.browsingData.remove` → `chrome.tabs.reload` を実行し、失敗時は `console.warn` で理由を残す。

## 操作フロー

1. `chrome://extensions/shortcuts` でショートカットの状態を確認・調整する。
2. `Ctrl+Shift+V` で HUD 出現、`Ctrl+Shift+Y` で localStorage/IndexedDB 削除＋リロード。
3. HUD の × ボタン、または再度ショートカットを押すと overlay を閉じる。
4. ログ実行機能は CSP の制限で除外し、表示とデータ削除に集中している。

## ディレクトリ構成

- `extension/`：React + TypeScript + Tailwind の Vite プロジェクト。`src/` に UI、`public/` に content script、`dist/` にビルド出力。
- `extension/src/assets/`：新アイコンや静的アセットを配置。
- `extension/dist/`：`npm run build` で生成される manifest / popup / service worker。Chrome ではこのフォルダを読み込む。
- ルート：`README.md` / `AGENTS.md` などはドキュメントや Codex ガイドライン。

## セットアップ

1. `cd extension`。
2. `npm install`。
3. `npm run dev` で popup を確認。
4. `npm run build` で `dist/` を生成し、Chrome に `extension/dist` を読み込む。

## 開発時のポイント

- `npm run lint`（`extension/` 内）を必ず通す。
- `extension/src/App.tsx` がショートカット UI を制御。service worker は `extension/public/service-worker.js`（ビルド済みは `dist/service-worker.js`）にある。
- localStorage 表示は content script で `dl` ではなく `key` 上 `value` 下のカード形式。

## 参考 GitHub リポジトリ

- [jariz/console-feed](https://github.com/jariz/console-feed)：React で console ログを HUD に再描画する例。UI の構成や log bundling の参考になる。
- [GoogleChrome/chrome-extensions-samples](https://github.com/GoogleChrome/chrome-extensions-samples)：MV3 で shortcut + background + popup をつなぐ基本。
- [microsoftedge/devtools-extension-samples](https://github.com/microsoftedge/devtools-extension-samples)：DevTools 系 UI を作る際の manifest / overlay 設計の参考。
