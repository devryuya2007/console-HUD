# console-HUD

console-HUD は、DevTools を毎回開かずともショートカットキーで localStorage や強制リロード処理を呼び出せる Chrome 拡張機能です。現在表示しているサイト単位で localStorage や IndexedDB を削除し、オーバーレイで JSON 整形済みのデータを眺められる HUD を提供します。

## アプリ概要

- **ハードリセット** (`Ctrl+Shift+Y`)：対象ページの localStorage/IndexedDB を削除したあと `chrome.tabs.reload` で再読込。
- **localStorage 表示** (`Ctrl+Shift+V`)：HUD で JSON を整形表示、キーが上で値が十分なスペースで下に並ぶカードが開き、右上の「✕」や再度ショートカットを押すと閉じる。
- **運用設計**：service worker でブラウザ API を握り、ポップアップ（React）が命令を送るだけ。失敗時は `console.warn` ログを残し、常にリロードまで実行する。

## 操作説明

1. Chrome 拡張ページ（`chrome://extensions/shortcuts`）で `console-HUD` のショートカットを確認する。
2. 任意のページで `Ctrl+Shift+V` を押すと localStorage HUD が表示される。ボタンや `ESC` などの独自機能はなく、×ボタン/再ショートカットで閉じて通常閲覧に戻る。
3. `Ctrl+Shift+Y` で localStorage と indexedDB を origin 指定で削除し、その後 `chrome.tabs.reload` でページを再読み込みする。
4. HUD 内の `console` 実行機能は CSP の制限で除外しているため、ログ取得とストレージ確認に特化している。

## ディレクトリ構成

- `extension/`：React + TypeScript + Tailwind CSS の Vite プロジェクト。`src/` に UI、`public/` に content script、`dist/` にビルド済みアセット・manifest・content script。
- `extension/src/assets/`：追加したアイコンや静的アセットを配置。`popup.html` はこのアイコンを favicon に使う。
- `AGENTS.md` など：Codex ガイドラインやプロジェクト補助資料。

## 開発手順

1. `cd extension` して依存関係をインストール（`npm install`）。
2. `npm run dev` で開発サーバーを起動し、`popup.html` から React UI を確認。
3. `npm run build` で `dist/` に manifest とビルド済みアセットを生成する。

## 検証と lint

- `npm run lint`（`extension/` 内）を必ず通す。`eslint` の警告・エラーがある場合は修正して再実行。
- ビルド成果物を Chrome に読み込む際は `extension/dist` を指定して manifest と一緒にデプロイ。

## 参考になりそうな GitHub プロジェクト

- [jariz/console-feed](https://github.com/jariz/console-feed)：React で console ログを再描画するライブラリ。HUD のログキャプチャ部分に似た思想。
- [GoogleChrome/chrome-extensions-samples](https://github.com/GoogleChrome/chrome-extensions-samples)：Chrome MV3 で background、popup、content の連携を学べるサンプル群。service worker + shortcut 利用も多数。
- [microsoftedge/devtools-extension-samples](https://github.com/microsoftedge/devtools-extension-samples)：DevTools 周りに近い機能を拡張する例があり、日々のデバッグツールの構築参考になる。
