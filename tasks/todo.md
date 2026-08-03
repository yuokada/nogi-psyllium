# Issue #34: ライト / ダークテーマ切替

Plan Review: PASS（保存値 → OS 設定 →ライトの優先順位、URL 非干渉、全画面の意味ベース CSS 変数化、例外時フォールバック、検証範囲を確認済み）

- [x] テーマ型・初期解決・DOM 適用・保存処理を共有ロジックとして実装する
- [x] React 描画前に初期テーマを適用する
- [x] アクセシブルなテーマ切替ボタンをヘッダーへ追加する
- [x] 全タブ・フォーム・状態表示を意味ベースの CSS 変数へ移行する
- [x] テーマロジックと切替操作のテストを追加する
- [x] README と現行仕様書を更新する
- [x] React Doctor を実行しツール障害を記録、test、lint、build で検証する

## Review

- `src/theme.ts` にテーマの純粋関数と副作用を集約し、`main.tsx` から React 描画前に初期テーマを適用した。
- 保存値を OS 設定より優先し、不正値や `localStorage` / `matchMedia` の例外時は安全にフォールバックする。
- テーマは URL 状態と分離し、切替時は `<html data-theme>` と `localStorage` のみ更新する。
- 全画面の共通配色を意味ベースの CSS 変数へ移行し、サイリウム固有色と既存の動的文字色は変更していない。
- Staff review を反映し、トグルの accessible name を「ダークテーマ」に固定して状態を `aria-pressed` で表現した。
- ヘッダーを通常フローのレスポンシブ grid に変更し、768px以下は縦配置、GitHub Corner の領域も確保した。
- テーマ切替前後で URL の `href`・`search`・`hash` が不変であるテストを追加した。
- Staff Engineer 再レビュー: APPROVED（ブロッキング指摘なし）。
- `npm test`: 2ファイル・10テスト成功。
- `npm run lint`: エラーなし（既存の Biome schema / CLI patch version 差の info のみ）。
- `npm run build`: 成功（CI と同様に事前に `public/data/` を作成）。
- React Doctor: `npx -y react-doctor@latest` は oxc-parser の macOS ARM native binding 欠落、ローカル版は内部 TypeError で診断開始前に停止。コード診断結果は取得できなかった。
- `git diff --check`: 問題なし。
