# 概要
- README を章立てごとに刷新し、タイトル・バッジ、TL;DR、機能、インストール、使い方、権限、フォルダ構成、開発方法、FAQ、ライセンスを揃えた。
- 目次を追加し、各章へすぐ飛べるようにリンク化した（スクショセクションは削除）。
- フォルダ構成セクションを図解（ASCII ツリー）で書き換えて、各ディレクトリの役割を説明。
- Chrome拡張アイコンを 901x904 PNG から 128x128 PNG に整形し、`manifest.json` に `action.default_icon` を追加して popup/toolbar の両方で表示されるようにした。

# 変更内容
- `README.md` をゼロから再構成し、指定された章立てで内容を整理。スクショ / デモ項目は削除。
- Permissions セクションで `storage` / `browsingData` / `tabs` / `activeTab` / `scripting` / `host_permissions` それぞれの目的を追記。
- `extension/public/icon.png` を変換し、`npm run build` で `dist/icon.png` も 128px へ更新。
- `manifest.json` に `action.default_icon` を追加し、ビルド成果物でも同じアイコン設定が反映されることを確認。

# 動作確認
- `cd extension && npm run build`

# 影響範囲 / リスク
- ドキュメント刷新のみでアプリ挙動は変わらない。

# 関連Issue
- 特になし
