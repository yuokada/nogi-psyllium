# 静的OGP対応 仕様（GitHub Pages / SPA向け）v1.0

## 1. 目的
GitHub Pages でホストするSPA（Vite + React）に対して、SNS共有時に表示されるOGP（Open Graph Protocol）/Twitter Cardを **静的** に設定する。

> 注意: GitHub Pages はサーバサイド処理がないため、URLごとに動的にOGPを変える「動的OGP」は対象外。

---

## 2. 対象範囲
- アプリ全体（トップページ）に対する **固定OGP** を提供する
- メンバー別OGP（URLごとに title/image を変える）は **将来拡張**（本仕様では扱わない）

---

## 3. 期待する挙動
- X(Twitter) / Facebook / LINE / Discord / Slack 等でURLを貼り付けると、以下がプレビュー表示される
  - タイトル
  - 説明
  - サムネイル画像
- クローラーがJavaScriptを実行しない環境でもプレビューが生成される（= HTMLの`<head>`に静的に埋め込む）

---

## 4. メタタグ仕様

### 4.1 Open Graph（必須）
`index.html` の `<head>` に以下を設定する。

- `og:title` : アプリ名
- `og:description` : アプリ説明
- `og:type` : `website`
- `og:url` : 正規URL（GitHub Pagesの公開URL）
- `og:image` : 絶対URLの画像
- `og:site_name` : サイト名（任意）
- `og:locale` : `ja_JP`（任意）

#### 例

```html
<meta property="og:title" content="乃木坂46 サイリウムカラー一覧" />
<meta property="og:description" content="メンバー別のサイリウムカラーを検索・フィルタ表示できます。" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://<user>.github.io/<repo>/" />
<meta property="og:image" content="https://<user>.github.io/<repo>/ogp/ogp.png" />
<meta property="og:site_name" content="nogi-psyllium" />
<meta property="og:locale" content="ja_JP" />
```

### 4.2 Twitter Card（推奨）

- `twitter:card` : `summary_large_image`
- `twitter:title`
- `twitter:description`
- `twitter:image`

#### 例

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="乃木坂46 サイリウムカラー一覧" />
<meta name="twitter:description" content="メンバー別のサイリウムカラーを検索・フィルタ表示できます。" />
<meta name="twitter:image" content="https://<user>.github.io/<repo>/ogp/ogp.png" />
```

---

## 5. OGP画像仕様

### 5.1 配置
- `public/ogp/ogp.png` に配置する（Viteビルド後は `/ogp/ogp.png` として配信される）

### 5.2 推奨サイズ
- 推奨: **1200 × 630 px**（OGPの標準的サイズ）
- 形式: PNG または JPEG
- 容量: できれば 1MB未満（軽量化推奨）

### 5.3 画像内容（推奨）
- サイト名（例：乃木坂46 サイリウムカラー）
- 簡単な説明（例：検索・期別フィルタ対応）
- サンプルの色チップ（視覚的に分かりやすい）

---

## 6. 実装方針（Vite / React）

- `index.html` に静的metaタグを埋め込む
- 画像は `public/` 配下に配置する
- `og:url` と `og:image` は **絶対URL** を使用する
  - GitHub Pagesの base path（`/<repo>/`）を含めること

---

## 7. 制約・注意事項

- SPAのルーティング（例：`/member/:name`）ごとにOGPを変えることは不可（静的HTMLが1つのため）
- React側で`document.head`を書き換えてもSNSクローラーには基本反映されない
- OGPの反映はSNS側キャッシュにより遅延することがある（デバッグ時は各サービスのカードバリデータを使用）

---

## 8. 受け入れ条件（Acceptance Criteria）

- GitHub Pagesにデプロイ後、トップURLをSNSに貼るとカードプレビューが表示される
- `og:image` の画像が取得可能である（ブラウザで直接開ける）
- OGPが無い場合と比較して、タイトル/説明/画像が期待通りに表示される

---

## 9. 将来拡張（Future Work）

- メンバー別OGP（静的ページ事前生成 or 別ホスティングで動的生成）
- OGP画像の自動生成（Canvas/Puppeteer等でビルド時生成）
- `canonical` の追加、`robots` 設定、サイトマップ生成

---

以上
