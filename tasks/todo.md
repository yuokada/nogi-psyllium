# TODO

- [x] `data/singles.yaml` を追加し、`public/data/singles.json` 生成フローを組み込む
- [x] 型定義とデータ取得処理に `SingleRelease` を追加する
- [x] タイムライン変換をシングル発売とアンダーライブの混在表示に対応させる
- [x] タイムライン関連テストを追加し、表示回帰を確認する
- [x] `lint` `test` `build` `react-doctor` で検証する

## Review

- `data/singles.yaml` を新設し、34th〜41st シングル発売日と公式ページ URL を管理対象に追加した
- `data/singles.yaml` の 34th〜41st に、歌唱曲のみの `tracks` を `title + editions[]` 形式で追加した
- `package.json` の `predev` / `prebuild` で `singles.yaml` から `public/data/singles.json` を生成するようにした
- `src/types.ts` `src/App.tsx` `src/singles.ts` `src/timeline.ts` を更新し、`SingleRelease` の取得・検証とタイムライン統合表示に対応した
- `src/timeline.test.ts` と `src/components/TimelinePanel.test.tsx` を追加し、混在ソートと出典リンク条件表示を検証した
- `src/singles.test.ts` を追加し、`tracks` あり/なしと不正な `editions` の検証を追加した
- 検証結果: `npm run lint` / `npm test` / `npm run build` は成功
- 検証結果: `npm run doctor` は 99/100。`src/components/BookmarkletPanel.tsx:29` の既存 `useMemo` 警告が 1 件あるが、今回変更箇所には起因しない
