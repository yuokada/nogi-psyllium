# 乃木坂46 サイリウムカラー一覧

乃木坂46メンバーのサイリウムカラーを一覧表示する React + TypeScript + Vite 製の Web アプリです。

## セットアップ

```bash
npm install
```

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

## CSVファイルの更新

メンバーデータは `data/members.csv` で管理しています。

### CSVのフォーマット

```
name,gen,color1_name,color2_name,icon
伊藤 理々杏,3期生,紫,赤,/icons/sample.png
```

| カラム名 | 必須 | 説明 |
| --- | --- | --- |
| `name` | 必須 | メンバー名 |
| `gen` | 任意 | 期（例: `3期生`） |
| `color1_name` | 必須 | サイリウムカラー1（メインカラー） |
| `color2_name` | 任意 | サイリウムカラー2（サブカラー） |
| `icon` | 任意 | アイコン画像のパス |

### メンバーを追加・更新する手順

1. `data/members.csv` をテキストエディタで開く
2. 上記フォーマットに従って行を追加・編集する
3. 開発サーバーを起動して表示を確認する（`npm run dev`）
4. 問題なければコミットしてプッシュする

> **注意**: 色名は `src/colors.ts` に定義されているものを使用してください。未定義の色名はグレーで表示されます。

## その他のコマンド

```bash
npm run lint      # Biome によるコードチェック
npm run preview   # ビルド成果物のプレビュー
```
