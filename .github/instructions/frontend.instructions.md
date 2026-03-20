---
applyTo: "src/**/*.{ts,tsx,css},package.json,biome.json,index.html"
---

フロントエンド関連ファイルを編集する場合は、以下を守ってください。

- React + TypeScript + Vite 構成を前提にし、GitHub Pages 向けのルーティング前提を壊さない。
- 共通ロジックは既存の hooks や utility に寄せ、コンポーネント間で重複実装を増やさない。
- Biome や TypeScript の既存設定に沿って変更し、別系統の整形・lint 手段を増やさない。
- UI 変更では共有 URL、検索条件、表示切り替えなど既存の操作体験の一貫性を保つ。
