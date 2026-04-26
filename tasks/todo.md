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
- タイムラインを日付単位表示へ変更し、アンダーライブを開催日ごとの行に分割して左側に `YYYY.MM.DD` を出すUIへ更新した
- `src/App.css` と `src/components/TimelinePanel.tsx` を更新し、左カラム日付・中央レール・右カラム本文のレイアウトに変更した
- 複数日イベントは再び 1イベント1行へ戻し、左側を日付範囲表示、右側に個別開催日の一覧を出す構成に調整した
- 検証結果: `npm run lint` / `npm test` / `npm run build` は成功
- 検証結果: `npm run doctor` は 99/100。`src/components/BookmarkletPanel.tsx:29` の既存 `useMemo` 警告が 1 件あるが、今回変更箇所には起因しない
