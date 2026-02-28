# 乃木坂46 サイリウムカラー Viewer

乃木坂46メンバーのサイリウムカラーとアンダーライブ出演情報を表示する React + TypeScript + Vite 製の Web アプリです。

## 機能

- **サイリウムカラータブ**: メンバーごとのペンライトカラーを一覧表示。名前・期・色名で絞り込み可能
- **アンダーライブタブ**: SG 別のアンダーライブ出演メンバーとセンター情報を表示
- **URL 共有**: 検索条件・選択中のアンダーライブをURLで共有できる「リンクをコピー」ボタン

## セットアップ

```bash
npm install
```

> **注意**: `predev` / `prebuild` スクリプトで [`yq`](https://github.com/mikefarah/yq) を使用します。未インストールの場合はあらかじめインストールしてください（`brew install yq` など）。

## 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開くとアプリが表示されます。

## ビルド

```bash
npm run build
```

ビルド成果物は `dist/` に出力されます。

## データファイルの更新

### メンバーデータ (`data/members.yaml`)

```yaml
- id: ito_riria
  name: 伊藤 理々杏
  gen: 3期生
  color1_name: 紫
  color2_name: 赤
  active: true
```

| フィールド | 必須 | 説明 |
| --- | --- | --- |
| `id` | 必須 | 一意の識別子（スネークケース） |
| `name` | 必須 | メンバー名 |
| `gen` | 任意 | 期（例: `3期生`） |
| `color1_name` | 必須 | サイリウムカラー1 |
| `color2_name` | 必須 | サイリウムカラー2 |
| `icon` | 任意 | アイコン画像のパス |
| `active` | 任意 | 在籍中なら `true`、卒業済みなら `false`（省略時は非表示扱い） |

> **注意**: 色名は `src/colors.ts` に定義されているものを使用してください。未定義の色名はグレーで表示されます。

> **注意**: デフォルト表示では `active: true` のメンバーのみ表示されます。画面上の「卒業メンバーを含む」チェックボックスをオンにすると全メンバーを表示できます。

### アンダーライブデータ (`data/underlives.yaml`)

```yaml
- id: ul_41st_2026
  title: "41stSGアンダーライブ"
  year: 2026
  dates:
    - "2026-03-17"
    - "2026-03-18"
  venue: "ぴあアリーナMM"
  source_url: "https://example.com"
  centers:
    - id: okamoto_hina
  member_ids:
    - ito_riria
    - okamoto_hina
  absent:
    - id: okuda_iroha
      note: "スケジュールの都合により休演"
```

| フィールド | 必須 | 説明 |
| --- | --- | --- |
| `id` | 必須 | 一意の識別子 |
| `title` | 必須 | 表示タイトル |
| `year` | 必須 | 開催年 |
| `dates` | 必須 | 公演日のリスト（`YYYY-MM-DD`） |
| `venue` | 任意 | 会場名 |
| `source_url` | 任意 | 出典 URL |
| `member_ids` | 必須 | 出演メンバーの `id` リスト |
| `centers` | 任意 | センターメンバーの `id` リスト（センターカードを強調表示） |
| `absent` | 任意 | 欠席メンバーの `id` と理由 |

### データを追加・更新する手順

1. 該当の YAML ファイルをテキストエディタで開く
2. フォーマットに従って追加・編集する
3. `npm run dev` で表示を確認する
4. 問題なければコミットしてプッシュする

## JSONスキーマファイルの更新

`schema/` ディレクトリに YAML データファイルの構造を定義した YAML スキーマファイルがあります。

| スキーマファイル | 対象 |
| --- | --- |
| `schema/members.schema.yaml` | `data/members.yaml` |
| `schema/underlives.schema.yaml` | `data/underlives.yaml` |

### ローカルでのスキーマ検証

```bash
pip install check-jsonschema

check-jsonschema --schemafile schema/members.schema.yaml data/members.yaml
check-jsonschema --schemafile schema/underlives.schema.yaml data/underlives.yaml
```

### スキーマを更新するタイミング

- **新しいフィールドを追加する場合**: 対応するスキーマファイルの `properties` に新しいフィールドを定義し、必須の場合は `required` 配列にも追加します
- **サイリウムカラーを追加する場合**: `src/colors.ts` に色を追加したあと、`schema/members.schema.yaml` の `color1_name` と `color2_name` の `enum` にも追加します

### GitHub Actions による自動検証

`data/*.yaml` または `schema/*.yaml` を変更してプッシュ・プルリクエストを作成すると、自動的にスキーマ検証が実行されます。

## その他のコマンド

```bash
npm run lint      # Biome によるコードチェック
npm run doctor    # React のアンチパターン検出（react-doctor）
npm run preview   # ビルド成果物のプレビュー
```

`npm run doctor` は `react-doctor.config.json` を参照します。現在は `react-doctor/no-fetch-in-effect` を ignore に設定しています。

## pre-commit

[pre-commit](https://pre-commit.com/) を使用してコミット前に自動チェックを実行します。

```bash
# pre-commit のインストール（初回のみ）
pip install pre-commit
pre-commit install
```

設定済みのフック:

- **pre-commit-hooks**: ファイル末尾改行・trailing whitespace・マージ競合などの基本チェック
- **biome-check**: フォーマット・import整理・lint・安全な自動修正
