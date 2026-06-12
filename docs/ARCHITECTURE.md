# NWT Linker — Architecture

## 1. 技術スタック

| 項目 | 採用技術 | 備考 |
|---|---|---|
| プラグイン種別 | Obsidian Community Plugin | `manifest.json` で配布 |
| 言語 | TypeScript (strict) | `tsconfig.json` で型安全性を優先 |
| ビルド | esbuild | `src/main.ts` を `main.js` にバンドル |
| 依存管理 | npm | `package.json` のスクリプトで実行 |
| データ | JSON | `data/*.json` に静的テーブルを置く |

---

## 2. 現在の構成

現時点の主要な実ファイル構成は次のとおり。

```text
.
├── data/
│   ├── aliases.json
│   └── verse-map.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DECISIONS.md
│   ├── spec.md
│   └── tasks/
│       └── phase1.md
├── src/
│   ├── main.ts
│   └── settings.ts
├── esbuild.config.mjs
├── manifest.json
├── package.json
├── styles.css
├── tsconfig.json
└── versions.json
```

### ファイルの役割

- `src/main.ts`
  - プラグインのエントリポイント
  - `onload` / `onunload` などのライフサイクル管理
  - コマンド登録や設定初期化の起点
- `src/settings.ts`
  - 設定型、デフォルト値、設定タブUI
  - 将来的に設定が増えても、まずここを起点に拡張する
- `data/aliases.json`
  - 書名エイリアスのデフォルトテーブル
- `data/verse-map.json`
  - 章・節の検証に使う静的データ
- `docs/spec.md`
  - 振る舞いの仕様書
- `docs/tasks/phase1.md`
  - 実装の段階計画

この構成を前提に、実装文書は「現状の実装」と「将来の分割案」を混同しないように保つ。

---

## 3. 将来の分割方針

現状のコードベースは最小構成なので、機能が増えたときにのみモジュールを追加する。

### 基本方針

- `main.ts` はできるだけ薄く保つ
- 解析・変換ロジックは純粋関数として分離する
- エディタ操作やUIはロジック層から切り離す
- 共有定数や型は別ファイルに逃がす

### 追加候補

以下は現時点では存在しない将来候補で、必要になったら導入する。

- `src/core/`
  - `normalize.ts`
  - `aliases.ts`
  - `parser.ts`
  - `bible-id.ts`
  - `url-builder.ts`
  - `converter.ts`
- `src/ui/`
  - `setting-tab.ts`
  - エディタ周辺のUIが必要になった場合の部品
- `src/types.ts`
  - 共通型定義
- `tests/`
  - ロジック層の単体テスト

この段階では、`plugin.ts` や `editor-plugin.ts` のような分割案を前提にしない。もし本当に必要になったら、実ファイルを作った時点でこの文書を更新する。

---

## 4. Obsidian プラグインとしての実装原則

- `src/main.ts` に業務ロジックを溜めない
- コマンド ID は安定させ、後から変更しない
- `this.register*` 系を使ってイベントや interval を必ず解放する
- ネットワークアクセスは、機能上どうしても必要な場合だけに限定する
- モバイル互換が必要なら Node/Electron 固有 API を避ける
- 静的データは `data/` に置き、ビルド生成物と混ぜない

---

## 5. この文書の位置づけ

`docs/ARCHITECTURE.md` は実装の羅針盤であり、`docs/spec.md` の詳細仕様を補助する。

- 実ファイル構成が変わったら、この文書も追従する
- 詳細な実装順は `docs/tasks/phase1.md` に置く
- ここでは「存在するもの」と「将来の候補」を明確に分ける
