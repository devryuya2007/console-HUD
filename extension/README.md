# console-HUD

`extension/` は Vite + React + Tailwind CSS で構築された、Chrome 拡張機能のポップアップ UI を収めるディレクトリです。

## セットアップ

1. `npm install` で依存パッケージを揃える（Tailwind, PostCSS, Autoprefixer などを含む）。
2. `npm run dev` で `popup.html` をホットリロードしながら開発。
3. `npm run build` で `dist/` に拡張機能出力を生成し、`manifest.json` とセットで Chrome に読み込ませる。
4. `npm run test` で Vitest による自動テストを確認する。

## 開発のポイント

- `src/App.tsx` にはタブの色分けやグラデーションを活かした HUD の構成を記述済み。
- `src/index.css` で `@tailwind base/components/utilities` を読み込み、全体のフォント・背景を整えている。
- `manifest.json` には `popup.html` を `action.default_popup` に指定し、ホスト権限やショートカットを定義している。

## 今後やること

- ストレージ操作の機能実装を `QuickAction` に連動させる。
- `manifest.json` の `permissions` を最小限にしつつ、必要な API のみ明示。
