# console-HUD

[![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-MV3-blue)](https://developer.chrome.com/docs/extensions/mv3/) [![Built with React](https://img.shields.io/badge/React-Tailwind-61dafb)](https://react.dev/) [![License MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## TL;DR

DevTools を開かずに `Ctrl+Shift+V / Ctrl+Shift+Y` だけで localStorage / IndexedDB を可視化して消し、すぐリロードできる HUD 付き Chrome 拡張。

## 目次

1. [Features](#features)
2. [Install](#install)
3. [Usage ＆ Shortcuts](#usage--shortcuts)
4. [Permissions / Privacy](#permissions--privacy)
5. [Folder structure](#folder-structure)
6. [Development / Build](#development--build)
7. [FAQ / Troubleshooting](#faq--troubleshooting)
8. [License](#license)

## Features

- localStorage をカードレイアウトで一括表示し、キーを上・JSON を下にして読みやすく整形。
- `Ctrl+Shift+Y` で localStorage/IndexedDB を service worker 経由で削除 → ページを自動リロード。
- ポップアップ HUD にタブカラーと光る枠を付けて、重要数値→コメントの順に視線誘導。
- ショートカット動作・HUD 状態を React + Tailwind で管理し、デバッグ効率を上げる。

## Install

1. `git clone https://github.com/your-account/console-HUD.git`
2. `cd console-HUD/extension`
3. `npm install`
4. `npm run build` で `extension/dist` を生成
5. Chrome の `chrome://extensions` で「デベロッパーモード」を ON → 「パッケージ化されていない拡張機能を読み込む」で `extension/dist` を選択

## Usage ＆ Shortcuts

1. `chrome://extensions/shortcuts` でショートカット割り当てを確認。デフォルトは `Ctrl+Shift+V`（HUD 表示）と `Ctrl+Shift+Y`（ストレージ削除+リロード）。
2. 任意のタブで `Ctrl+Shift+V` を押すと HUD が出現。再度押すか HUD の × ボタンで閉じる。
3. `Ctrl+Shift+Y` で localStorage/IndexedDB が削除され、同一タブがリロードされる。

| ショートカット | 動作 | 使いどころ |
| --- | --- | --- |
| `Ctrl+Shift+V` | HUD を表示 / 非表示 | JSON を目視でチェック |
| `Ctrl+Shift+Y` | localStorage / IndexedDB を削除してリロード | 状態リセットして挙動確認 |

## Permissions / Privacy

- `storage`：各タブの localStorage / IndexedDB を取得し、HUD で表示するため。
- `browsingData`：ショートカット（Ctrl+Shift+Y）から localStorage / IndexedDB を削除するため。
- `tabs`：`chrome.tabs.reload` で再読み込みしたり、対象タブの情報を取得するため。
- `activeTab`：ショートカットを実行したタブに限定して HUD を操作するため。
- `scripting`：content script を挿入し、HUD オーバーレイをページ上に描画するため。
- `host_permissions: "<all_urls>"`：任意のサイト上で HUD を動作させるため。表示した JSON や削除対象のストレージはブラウザ内で完結し、外部送信はしない。

## Folder structure

```
console-HUD (root)
├─ AGENTS.md
│   └─ Codex 用ガイドライン。作業ルールやコミット規約をここで確認する。
├─ README.md
│   └─ このファイル。拡張の概要やセットアップ手順を集約。
└─ extension/
    ├─ src/
    │   ├─ components/ …… HUD UI の React コンポーネント
    │   ├─ assets/ ………… アイコンや静的アセット
    │   └─ styles/ ……… Tailwind ベースの共通スタイル
    ├─ public/
    │   ├─ content-script.js …… DOM へ HUD を挿入するスクリプト
    │   └─ service-worker.js … Chrome API を叩くバックグラウンド
    ├─ dist/
    │   └─ npm run build で生成。Chrome に読み込ませる実体
    ├─ manifest.json …… MV3 のショートカット・権限設定
    └─ package.json …… 依存と npm scripts
```

## Development / Build

1. `cd extension`
2. `npm install`
3. `npm run dev` で popup をホットリロードしながら UI 調整
4. `npm run lint` で ESLint を実行（ルールに従い整える）
5. `npm run test`（任意）で Vitest を実行
6. `npm run build` で Chrome へ配布する `dist/` を作成

## FAQ / Troubleshooting

- **ショートカットが反応しない**：`chrome://extensions/shortcuts` で割り当てが他アプリと競合していないか、ブラウザ再起動後に再確認。
- **HUD が表示されない**：コンテンツスクリプトが読み込まれていない可能性。`extension/dist` を再ビルド→再読み込み。
- **localStorage が消えない**：対象タブが chrome://～ のような拡張から操作できないページであるケース。通常サイトで試す。
- **権限ダイアログが出る**：`browsingData` 権限付与が必要。許可後にもう一度ショートカットを試す。

## License

MIT License (c) 2025 devryuya2007 — 詳細は [LICENSE](LICENSE) を参照。
