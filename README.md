# console-HUD

console-HUD は、毎回 DevTools を開かなくても、ショートカットキーからコンソールやストレージ操作を呼び出せる開発者向け拡張機能です。localStorage の確認・クリア・値の編集など、よく行う軽量なデバッグ作業を、ページ上の HUD から素早く実行できます。

## ディレクトリ構成

- `extension/`：React + TypeScript + Tailwind CSS で作る Vite ベースの拡張機能 UI。HUD のソース・ビルド出力・manifest は全部ここ。
- その他のファイル（`AGENTS.md` など）はビルドに関係ない補助資料としてルートに置き、extension フォルダー以下を実質的なプロジェクトとして扱う。

## 開発手順

1. `cd extension` してから依存関係をインストール（`npm install`）。
2. `npm run dev` で `popup.html` をビルドサーバー越しに確認。
3. `npm run build` で拡張機能用の `dist/` 配下に `popup.html` とアセットを吐き出す。

## 検証と lint

- `npm run lint` は `extension/` の中で実行し、警告・エラーが出たら修正するのが基本サイクル。
- ビルド結果を Chrome の拡張機能として読み込むときは `extension/dist` を `manifest.json` と一緒に指定する。
