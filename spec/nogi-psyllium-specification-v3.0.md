# nogi-psyllium Webアプリケーション 仕様書 v3.0

> 本書は v1.0 / v1.1 / v2.0 / v2.1 の仕様書を統合し、**実際の実装を正として**記述した現行仕様書である。

---

# 1. 目的

乃木坂46メンバーのサイリウムカラー情報と、アンダーライブの出演メンバー・センター情報を
Web 上で一覧・検索・共有できる静的 SPA を GitHub Pages で公開する。

---

# 2. システム構成

## 2.1 アーキテクチャ

```
data/members.yaml     ─┐
data/underlives.yaml  ─┤ yq (predev / prebuild)
                       ↓
                  public/data/members.json
                  public/data/underlives.json
                       ↓
              React SPA (HashRouter)
                       ↓
                  GitHub Pages
```

## 2.2 ホスティング

- ホスティング: GitHub Pages
- 公開 URL: `https://yuokada.github.io/nogi-psyllium/`
- `vite.config.ts` の `base: "/nogi-psyllium/"` と対応
- CI/CD: GitHub Actions（`master` ブランチへの push で自動デプロイ）

---

# 3. 技術スタック

## 3.1 ランタイム依存（`dependencies`）

| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| react | ^19.2.0 | UI フレームワーク |
| react-dom | ^19.2.0 | DOM レンダリング |
| react-router-dom | ^7.13.0 | HashRouter / useLocation / useNavigate / useSearchParams |

## 3.2 開発依存（`devDependencies`）

| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| typescript | ~5.9.3 | 型チェック |
| vite | ^7.3.1 | バンドラー・開発サーバー |
| @vitejs/plugin-react | ^5.1.1 | Vite の React プラグイン |
| @biomejs/biome | 2.4.4 | フォーマット・lint |
| @types/react | ^19.2.7 | React 型定義 |
| @types/react-dom | ^19.2.3 | ReactDOM 型定義 |
| @types/node | ^25.2.3 | Node.js 型定義 |

## 3.3 ツール・前提条件

| ツール | バージョン | 用途 |
|--------|-----------|------|
| Node.js | 24系 | 実行環境（CI に準拠） |
| yq | v4.52.4以上 | YAML → JSON 変換（`brew install yq` 等） |
| pre-commit | 最新版 | コミット前自動チェック（任意） |

---

# 4. ディレクトリ構成

```
.
├── data/
│   ├── members.yaml        # メンバーマスタ（編集対象）
│   └── underlives.yaml     # アンダーライブデータ（編集対象）
├── public/
│   ├── data/               # yq が生成する JSON（Git 管理外）
│   │   ├── members.json
│   │   └── underlives.json
│   └── icons/              # メンバーアイコン（任意）
├── src/
│   ├── App.tsx             # メインコンポーネント
│   ├── App.css             # スタイル
│   ├── main.tsx            # エントリポイント（HashRouter）
│   ├── colors.ts           # サイリウムカラーマスタ
│   ├── types.ts            # TypeScript 型定義
│   ├── utils.ts            # ユーティリティ（輝度計算など）
│   └── index.css           # グローバルスタイル
├── spec/                   # 仕様書（本ファイルを含む）
├── .github/
│   └── workflows/
│       └── pages.yml       # GitHub Pages デプロイワークフロー
├── package.json
├── vite.config.ts
└── .pre-commit-config.yaml
```

---

# 5. データ仕様

## 5.1 メンバーデータ（`data/members.yaml`）

### フィールド定義

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | string | ✓ | 一意の識別子（スネークケース、例: `ito_riria`） |
| `name` | string | ✓ | メンバー名（表示用） |
| `gen` | string | | 期（例: `3期生`） |
| `color1_name` | string | ✓ | サイリウムカラー1（カラーマスタの色名） |
| `color2_name` | string | | サイリウムカラー2（カラーマスタの色名） |
| `icon` | string | | アイコン画像のパス（例: `/icons/sample.png`） |
| `active` | boolean | | `true`: 在籍中、`false`: 卒業済み（省略時: 非表示扱い） |

### 記述例

```yaml
- id: ito_riria
  name: 伊藤 理々杏
  gen: 3期生
  color1_name: 紫
  color2_name: 赤
  icon: /icons/sample.png
  active: true
```

### サイリウムカラーマスタ（`src/colors.ts`）

以下の色名のみ有効。未定義の色名はグレー（`#cccccc`）で表示される。

| 色名 | HEX |
|------|-----|
| 白 | `#FFFFFF` |
| オレンジ | `#FF8C00` |
| 青 | `#0000FF` |
| 黄 | `#FFD700` |
| 紫 | `#800080` |
| 緑 | `#008000` |
| ピンク | `#FF69B4` |
| 赤 | `#FF0000` |
| 水色 | `#87CEEB` |
| 黄緑 | `#ADFF2F` |
| ターコイズ | `#40E0D0` |
| 黒 | `#000000` |

### ペンライト色変更順

公式ペンライトの色変更順序（フッターに表示）:
白 → オレンジ → 青 → 黄 → 紫 → 緑 → ピンク → 赤 → 水色 → 黄緑 → ターコイズ

---

## 5.2 アンダーライブデータ（`data/underlives.yaml`）

### フィールド定義

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | string | ✓ | 一意の識別子（例: `ul_41st_2026`） |
| `title` | string | ✓ | 表示タイトル（例: `41stSGアンダーライブ`） |
| `year` | number | ✓ | 開催年 |
| `dates` | string[] | ✓ | 公演日のリスト（`YYYY-MM-DD` 形式） |
| `venue` | string | | 会場名 |
| `source_url` | string | | 出典 URL（セットリスト参照先など） |
| `member_ids` | string[] | ✓ | 出演メンバーの `id` リスト（`members.yaml` の `id` を使用） |
| `centers` | Center[] | | センターメンバー（省略時: センター強調なし） |
| `absent` | AbsentMember[] | | 欠席メンバー |

### `centers` フィールド

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | string | ✓ | `member_ids` に含まれるメンバーの `id` |
| `label` | string | | 表示ラベル（省略時: 1名→`C`、複数→`WC`） |

### `absent` フィールド

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | string | ✓ | 欠席メンバーの `id`（`members.yaml` の `id` を使用） |
| `note` | string | | 欠席理由（表示用） |

### 記述例

```yaml
- id: ul_41st_2026
  title: "41stSGアンダーライブ"
  year: 2026
  dates:
    - "2026-03-17"
    - "2026-03-18"
    - "2026-03-19"
  venue: "ぴあアリーナMM"
  source_url: "https://www.nogizaka46.com/s/n46/page/underlive"
  centers:
    - id: okamoto_hina
  member_ids:
    - ito_riria
    - okamoto_hina
    - sato_rika
  absent:
    - id: okuda_iroha
      note: 体調不良
```

---

## 5.3 ビルド時 JSON 生成（yq）

`npm run dev` / `npm run build` 実行前に `predev` / `prebuild` スクリプトが自動実行される。

```bash
yq -o=json data/members.yaml   > public/data/members.json
yq -o=json data/underlives.yaml > public/data/underlives.json
```

生成される JSON はそのまま TypeScript の型定義（`Member[]` / `Underlive[]`）と対応する。

---

# 6. 機能仕様

## 6.1 サイリウムカラータブ（`/#/`）

- メンバーカードのグリッド表示
- **検索**: 名前・期・色名による部分一致（大文字小文字無視）
- **期フィルタ**: ドロップダウンで1期生〜N期生を選択
- **卒業メンバーを含むトグル**: デフォルトは `active: true` のみ表示
- 表示件数を右上に表示

### メンバーカード表示要素

- メンバー名
- 期（任意）
- サイリウムカラー1（色名・背景色・自動テキスト色）
- サイリウムカラー2（任意、同上）

## 6.2 アンダーライブタブ（`/#/underlive`）

- セレクトボックスでアンダーライブを選択（URL `?id=` と同期）
- 選択中のアンダーライブのメタ情報表示:
  - 公演日（複数日の場合は `開始日 〜 最終日` 形式）
  - 会場名
  - 出典リンク
- 出演メンバー数の表示
- 出演メンバーカードのグリッド表示:
  - センターメンバーをリスト先頭に配置
  - センターカードは金色ボーダー + 👑 バッジで強調
- 欠席メンバーセクション（存在する場合）:
  - メンバー名 + 欠席理由（任意）

## 6.3 共有リンク（リンクをコピー）

- タブ右上に「リンクをコピー」ボタンを配置
- `navigator.clipboard.writeText(window.location.href)` でクリップボードに URL をコピー
- URL には現在の検索条件・フィルタ・選択中アンダーライブが含まれる

## 6.4 GitHub Corners

- ページ右上に Octocat アニメーション付きのリンクを表示（固定配置）
- リンク先: `https://github.com/yuokada/nogi-psyllium`
- ホバー時に腕が振るアニメーション（モバイルはページロード時）

---

# 7. URL 仕様（HashRouter）

HashRouter を採用しているため、GitHub Pages でリダイレクト設定なしに動作する。
ハッシュ以降の部分がルーティングに使用される。

## 7.1 パス定義

| パス | 表示 |
|------|------|
| `/#/` | サイリウムカラータブ |
| `/#/underlive` | アンダーライブタブ |

## 7.2 クエリパラメータ

| パラメータ | 対象タブ | 型 | 説明 |
|-----------|---------|-----|------|
| `q` | ペンライト | string | 検索キーワード |
| `gen` | ペンライト | string | 期フィルタ（例: `3期生`） |
| `graduated` | ペンライト | `0`\|`1` | 卒業メンバーを含む場合 `1` |
| `id` | アンダーライブ | string | 選択中のアンダーライブ ID |

## 7.3 URL 例

| 状態 | URL |
|------|-----|
| 初期表示 | `https://yuokada.github.io/nogi-psyllium/#/` |
| 検索「和」 | `https://yuokada.github.io/nogi-psyllium/#/?q=%E5%92%8C` |
| 3期生フィルタ | `https://yuokada.github.io/nogi-psyllium/#/?gen=3%E6%9C%9F%E7%94%9F` |
| 卒業込み | `https://yuokada.github.io/nogi-psyllium/#/?graduated=1` |
| アンダーライブ | `https://yuokada.github.io/nogi-psyllium/#/underlive` |
| アンダーライブ指定 | `https://yuokada.github.io/nogi-psyllium/#/underlive?id=ul_41st_2026` |

## 7.4 動作仕様

- React Router の `useSearchParams` で URL と UI 状態を同期
- `useLocation` でパスからタブを導出（`useState` 不使用）
- タブ切替は `navigate("/underlive")` / `navigate("/")` で history に push
- フィルタ変更は `setSearchParams(..., { replace: true })` で history を更新しない
- アンダーライブデータ読み込み後、URL の `?id=` に対応するエントリが存在しない場合は先頭エントリに自動フォールバック

---

# 8. UI 仕様

## 8.1 レスポンシブレイアウト

| 画面幅 | カードグリッド列数 |
|--------|-----------------|
| 901px 以上 | 6列 |
| 641〜900px | 3列 |
| 640px 以下 | 2列 |

## 8.2 センター強調表示（アンダーライブタブ）

- センターカードのボーダーカラー: `#f0c030`（ゴールド）
- センターカードのシャドウ: `rgba(240, 192, 48, 0.4)`
- 👑 バッジ: 背景 `#fff9e6`、テキスト `#b8860b`
- センターカードはグリッドの先頭に表示

## 8.3 テキストカラー自動調整（`src/utils.ts`）

色ボックスの背景色に応じてテキストカラーを自動選択する（WCAG 相対輝度準拠）。

```
輝度 = 0.2126 × R_linear + 0.7152 × G_linear + 0.0722 × B_linear
（R_linear = (R/255 <= 0.03928) ? R/255/12.92 : ((R/255+0.055)/1.055)^2.4）

輝度 > 0.179 → テキストカラー: #000000（黒）
輝度 ≤ 0.179 → テキストカラー: #ffffff（白）
```

---

# 9. ビルド・デプロイ仕様

## 9.1 npm scripts

| スクリプト | 内容 |
|-----------|------|
| `npm run dev` | 開発サーバー起動（`predev` で YAML→JSON 変換を実行） |
| `npm run build` | TypeScript チェック + Vite ビルド（`prebuild` で YAML→JSON 変換を実行） |
| `npm run lint` | Biome によるコードチェック |
| `npm run preview` | ビルド成果物のローカルプレビュー |

## 9.2 CI/CD（GitHub Actions: `.github/workflows/pages.yml`）

- トリガー: `master` ブランチへの push
- ランナー: `ubuntu-latest`
- Node.js: 24
- yq: v4.52.4（`/usr/local/bin/yq` に手動インストール）

ビルド手順:
1. `actions/checkout@v6`
2. `actions/setup-node@v6`（Node.js 24、npm キャッシュ有効）
3. yq をインストール
4. `npm ci`
5. `mkdir public/data/` + `npm run build`
6. `actions/upload-pages-artifact@v4`（`dist/` を成果物として登録）
7. `actions/deploy-pages@v4`（GitHub Pages にデプロイ）

## 9.3 コードチェック（Biome / pre-commit）

**Biome**（`biome.json` / `@biomejs/biome`）:
- フォーマット・import 整理・lint・安全な自動修正
- `npm run lint` で実行

**pre-commit**（`.pre-commit-config.yaml`）:
- コミット時に自動実行
- フック:
  - `pre-commit-hooks`: 末尾改行・trailing whitespace・マージ競合チェック
  - `biome-check`: Biome の自動修正

---

# 10. TypeScript 型定義（`src/types.ts`）

```typescript
interface Member {
  id: string;
  name: string;
  gen?: string;
  color1_name: string;
  color2_name?: string;
  icon?: string;
  active?: boolean;
}

interface AbsentMember {
  id: string;
  note?: string;
}

interface Center {
  id: string;
  label?: string;
}

interface Underlive {
  id: string;
  title: string;
  year: number;
  dates: string[];
  venue?: string;
  source_url?: string;
  member_ids: string[];
  absent?: AbsentMember[];
  centers?: Center[];
}
```

---

# 11. 将来拡張（Future Work）

- センター日別スコープ（`scope: all/day1/day2/day3`）+ 日別タブ表示
- ビルド時 YAML バリデーション（ID 整合性・色名チェック）
- メンバー詳細ページ
- 並び替え機能（名前順・期順）
- お気に入り機能
- ダーク / ライトテーマ切替
- `underlive_index.json` による一覧軽量化
- 他ライブカテゴリへの拡張（3期生ライブ等）

---

# 12. バージョン履歴

| バージョン | 内容 |
|-----------|------|
| v1.0 | 初版。CSV + 基本表示機能 |
| v1.1 | React Router 採用計画、URL 共有機能 |
| v2.0 | YAML 移行、アンダーライブ機能追加 |
| v2.1 | センター強調・日別スコープ設計 |
| **v3.0** | **実装ベースへの統合。HashRouter・Biome・GitHub Corners を正式記載** |

---

以上
