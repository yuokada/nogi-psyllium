# タイムラインタブ追加プロトタイプ設計

## Summary
既存の `アンダーライブ` データを横断表示し、日付の降順で確認できる `タイムライン` タブを追加する。
プロトタイプ段階では `data/underlives.yaml` のみを入力源とし、将来的に他の公演系・編成系データを追加できるよう、表示前に共通の `TimelineItem` へ変換する。

## Goals
- `/#/timeline` で直接開ける独立タブを追加する
- 複数日公演を日付単位のイベントへ分解し、時系列で新しい順に並べる
- 一覧表示用の共通モデルを導入し、将来のデータソース追加余地を残す

## Non-Goals
- 公演詳細の深掘り表示
- タイムライン専用の検索・フィルタ
- 選抜編成や他ライブ種別の実データ投入

## Data Model
```ts
type TimelineItemKind = "underlive";

type TimelineItem = {
  id: string;
  kind: TimelineItemKind;
  date: string;
  title: string;
  label: string;
  venue?: string;
  sourceUrl?: string;
  underliveId: string;
};
```

- `Underlive` は `dates` を持つため、1件の公演から複数の `TimelineItem` を生成する
- `id` は `underliveId + date` のような安定キーにする
- `label` は暫定的に `アンダーライブ`

## UI Design
- タブ名は `タイムライン`
- 各行に以下を表示する
  - 日付
  - タイトル
  - 種別ラベル
  - 会場
  - 出典リンク（ある場合）
- 一覧は `date` の降順でソートする
- データがない場合は空状態を表示する

## Implementation Plan
1. `src/types.ts` に `TimelineItem` と `TimelineItemKind` を追加する
2. `src/timeline.ts` を追加し、`Underlive[] -> TimelineItem[]` の変換を実装する
3. `src/components/TimelinePanel.tsx` を追加し、一覧表示を担当させる
4. `src/App.tsx` に `timeline` タブと `/#/timeline` ルートを追加する
5. `src/App.css` にタイムライン用の最小スタイルを追加する

## Verification
- `タイムライン` タブが表示されること
- `/#/timeline` で直接開けること
- `41stSGアンダーライブ` の 2026-03-19 / 2026-03-18 / 2026-03-17 が上から並ぶこと
- 既存の `サイリウムカラー` / `アンダーライブ` / `クイズ` に回帰がないこと
- `npm run lint`
- `npm test`
- `npm run build`

## Future Extensions
- `single_formation` や `birthday_live` など別種別を `TimelineItem` に変換して混在表示する
- 種別フィルタを追加する
- 行クリックで元データ詳細へ遷移する
