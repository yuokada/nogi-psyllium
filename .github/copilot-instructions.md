# GitHub Copilot Instructions

このリポジトリで作業する際は、以下の方針を優先してください。

## 基本方針

- ユーザー向けの説明、提案、レビューコメント、PR 要約は日本語で書く。
- 変更は最小限に留め、既存の React + TypeScript + Vite 構成との整合性を保つ。
- ローカル絶対パス、個人環境依存の設定、生成物の手動編集を持ち込まない。
- `data/*.yaml` を正本として扱い、生成物である `public/data/*.json` や `dist/` を手動編集しない。
- UI の変更では、検索、共有 URL、アンダーライブ表示、ブックマークレット機能の一貫性を崩さない。

## プロジェクト理解

- メイン実装は `src/` 配下にあり、コンポーネントは `src/components/`、共通ロジックは `src/hooks/` や `src/utils.ts` にある。
- データソースは `data/members.yaml` と `data/underlives.yaml` で、ビルド前に JSON へ変換される。
- 設定や依存関係は `package.json`、`biome.json`、Vite/TypeScript 設定ファイルで管理している。
- GitHub Pages 向けの公開や検証フローは `.github/workflows/` 配下にある。

## 実装と検証

- フロントエンド変更では `npm run lint` と `npm run test` を優先する。
- ビルドや公開影響がある変更では `npm run build` も検討する。
- 実施した確認と未実施の確認を明確に区別して伝える。
