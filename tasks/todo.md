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
- テーマ切替前後で URL の `href`・`search`・`hash` が不変であるテストを追加した。
- テーマ切替をヘッダーからタブ列へ移し、「リンクをコピー」と隣接する補助操作グループとして右寄せした。狭い画面ではグループ単位で折り返す。
- テーマ切替の表示を月アイコンのみの正方形ボタンに簡素化し、accessible name・`aria-pressed`・titleは維持した。
- Copilot review を反映し、センターカードの枠線とシャドウをテーマ別CSS変数へ移行し、仕様書のテーマ切替配置を現行UIへ合わせた。
- Staff Engineer 再レビュー: APPROVED（ブロッキング指摘なし）。
- `npm test`: 2ファイル・10テスト成功。
- `npm run lint`: エラーなし（既存の Biome schema / CLI patch version 差の info のみ）。
- `npm run build`: 成功（CI と同様に事前に `public/data/` を作成）。
- React Doctor: `npx -y react-doctor@latest` は oxc-parser の macOS ARM native binding 欠落、ローカル版は内部 TypeError で診断開始前に停止。コード診断結果は取得できなかった。
- `git diff --check`: 問題なし。

# pre-commit の Node 環境構築エラー

Plan Review: PASS（公式 Biome フックを維持する。nodeenv が最新版 alpha を選ばないよう、フック用 Node 22.16.0 を指定し、pre-commit を再実行する）

- [x] pre-commit ログとフック設定を照合して原因を特定する
- [x] 公式 Biome フックに Node 22.16.0 を指定する
- [x] pre-commit フックを再実行して結果を確認する

## Review

- 公式 Biome フックに `language_version: 22.16.0` を追加し、Node 27 alpha の自動選択を止めた。
- 通常の `pre-commit run` で全フックが成功。設定ファイルのみステージ済み。
- `pre-commit validate-config` と `git diff --check` が成功。
