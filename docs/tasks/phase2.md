# Phase 2: プリセット基盤（ja のみ）

> スコープは「将来の多言語対応のための土台」だけ。バンドルする言語は **J（日本語）** のみ。
> 残りの wtlocale（E, G, S, F, I, P, K, C, T, ...）はコミュニティ PR で順次追加する。

## 概要

現状、`settings.aliases` はフラットな `Record<string, number>` で、どの言語由来かが分からない。
Phase 2 では：

- `data/aliases-master.json` という **マスターデータ** を新設し、wtlocale キーで複数言語を持てるようにする
- 設定画面に **「Load aliases for current WT Locale」ボタン** を追加
  - クリックすると現在の `settings.wtlocale` に対応するマスターの `aliases` を読み込んで `settings.aliases` を置き換える
  - 既存の `ConfirmModal` で確認
  - 対応言語が無い場合は Notice を出して何もしない
- ユーザーが手動で `aliases` を編集したら「カスタム状態」と判定し、ロード元のプリセットを忘れる

`bible-book-names-intl` の vendoring スクリプトは **Phase 3 扱い**。今フェーズでは未着手。

---

## 2.1 データ構造

### 2.1.1 マスターデータ

**新規ファイル**: `data/aliases-master.json`

```json
{
  "J": {
    "name": "日本語",
    "iso": "ja",
    "source": "nwt",
    "note": "NWT 日本語版の表記に手動で精査",
    "aliases": {
      "創世記": 1,
      "...": "..."
    }
  }
}
```

- キー: jw.org の wtlocale コード（当面は `"J"` のみ）
- 各エントリ:
  - `name` (string): 設定画面の UI 表示名
  - `iso` (string): ISO 639-1 言語コード（リファレンス用）
  - `source` (string): `"nwt"` | `"community"` | `"manual"`
  - `note` (string, optional): 精度メモ
  - `aliases` (Record<string, number>): エイリアス → 書名番号

### 2.1.2 設定の型拡張

**`src/core/types.ts`** に追加：

```ts
export interface LocalePreset {
  name: string;
  iso: string;
  source: 'nwt' | 'community' | 'manual';
  note?: string;
  aliases: Record<string, number>;
}

export interface PluginSettings {
  enabled: boolean;
  debounceMs: number;
  wtlocale: string;
  pub: string;
  urlTemplate: string;
  aliases: Record<string, number>;
  /** 直前に Load aliases したプリセットの wtlocale。手動編集で null になる。 */
  loadedPreset: string | null;
}
```

### 2.1.3 既存 `data/aliases.json` の扱い

- **削除する**。内容は `data/aliases-master.json` の `J` エントリに移植する。
- `src/core/settings-utils.ts` の import 参照も合わせて書き換える。

---

## 2.2 マスターデータ読み込み層

### 2.2.1 新規ファイル: `src/core/aliases-presets.ts`

```ts
import masterData from '../../data/aliases-master.json';

export type { LocalePreset };

const PRESETS: Record<string, LocalePreset> = masterData as Record<string, LocalePreset>;

/** 指定 wtlocale のプリセットを返す。なければ null。 */
export function getPreset(wtlocale: string): LocalePreset | null {
  return PRESETS[wtlocale] ?? null;
}

/** バンドルされている wtlocale 一覧。 */
export function listAvailableLocales(): string[] {
  return Object.keys(PRESETS);
}
```

- JSON を `import` で直接バンドル（esbuild がビルド時にインライン化）
- ランタイムで fetch しない
- テストからも import 可能

---

## 2.3 `settings-utils.ts` の更新

**`src/core/settings-utils.ts`**：

- import を `data/aliases.json` → `data/aliases-master.json`（`getPreset` 経由）に変更
- デフォルトを `J` プリセットから取得する
- 初期化時に `loadedPreset` を `"J"` にセットする（ja プリセットから立ち上げる既存挙動を維持）

```ts
import { PluginSettings } from './types';
import { getPreset } from './aliases-presets';

export function ensureDefaultAliases(settings: PluginSettings): boolean {
  if (!settings.aliases || Object.keys(settings.aliases).length === 0) {
    const preset = getPreset(settings.wtlocale) ?? getPreset('J');
    if (!preset) {
      // マスターデータが空。最低限フォールバック。
      settings.aliases = {};
      return false;
    }
    settings.aliases = { ...preset.aliases };
    settings.loadedPreset = settings.wtlocale;
    return true;
  }
  return false;
}
```

---

## 2.4 設定 UI の更新

### 2.4.1 ボタン仕様

`src/settings.ts` の「Reset to Defaults (JP)」ボタンを **「Load aliases for current WT Locale」** に置換する。

- ラベル: `Load aliases for [wtlocale]`
  - wtlocale が空、または `aliases-master.json` に存在しない wtlocale の場合: `Load aliases for current WT Locale`（汎用ラベル）
  - 存在する場合: `Load aliases (E — English)` のようにメタ表示
- クリック時:
  1. 現在の `settings.aliases` が `settings.loadedPreset` 由来で **かつ** ユーザーが編集していない（`loadedPreset === wtlocale`）場合、確認ダイアログはスキップして即ロード
  2. それ以外は `ConfirmModal` で確認
     - 文言: `Replace current aliases with the "{name}" ({wtlocale}) preset? This will discard any custom aliases you've added.`
  3. 確認後:
     - `settings.aliases = JSON.parse(JSON.stringify(preset.aliases))`（ディープコピー）
     - `settings.loadedPreset = wtlocale`
     - `await this.plugin.saveSettings()`
     - `this.display()` で再描画
- wtlocale が `aliases-master.json` に存在しない場合:
  - Notice: `No preset available for locale "X". Add it to data/aliases-master.json.`
  - ボタンは押せるが何も起こらない

### 2.4.2 エイリアス編集時の `loadedPreset` リセット

`SampleSettingTab.display()` 内の以下の操作で `loadedPreset = null` にする：

- `Add new alias` ボタン
- 既存エイリアスの `Book #` 編集
- 既存エイリアスの `Delete` ボタン
- `Import JSON` ボタン
- `Load aliases` ボタン経由でない手動の全置換

エイリアス一覧のラベルに、現在の状態を表示：

- `loadedPreset !== null`: `Currently loaded: {presetName} ({wtlocale})`
- `loadedPreset === null`: `Currently: custom (manually edited)`

### 2.4.3 既存挙動の維持

- `wtlocale` のテキスト入力はそのまま（Phase 2 ではドロップダウン化しない）
- `pub`, `urlTemplate`, `enabled`, `debounceMs` の設定項目は触らない

---

## 2.5 テスト

### 2.5.1 `tests/aliases.test.ts`

- 既存テストはそのまま動く（`findBookMatch` のシグネチャは変えない）
- マスターデータの型整合性チェックとして、軽いテストを追加：
  - `data/aliases-master.json` のすべての値が正しい型である
  - `aliases` の値が 1〜66 の範囲
  - 必須フィールド（`name`, `iso`, `source`, `aliases`）が欠けていない
  - これは `src/core/aliases-presets.test.ts` として新設する

### 2.5.2 `tests/settings-utils.test.ts`

- import 参照を `data/aliases.json` → `aliases-presets` 経由に
- `ensureDefaultAliases` のテストは `loadedPreset` の挙動を検証するように更新
- 新規テストケース:
  - `loadedPreset` が空 → 初期化時に `"J"` セット
  - `loadedPreset` が既に `"J"` → 触らない

### 2.5.3 新規: `tests/aliases-presets.test.ts`

- `getPreset('J')` が null でない
- `getPreset('Z')` が null（存在しない wtlocale）
- `listAvailableLocales()` に `"J"` が含まれる
- マスターデータの各プリエントリがバリデーションを通る

---

## 2.6 ドキュメント

### 2.6.1 `docs/ARCHITECTURE.md`

- 「2. 現在の構成」セクションのツリーに `data/aliases-master.json` を追記
- 「3. 将来の分割方針」セクションに `src/core/aliases-presets.ts` を追加
- 「4. Obsidian プラグインとしての実装原則」に「データ取得元を一元化する」を追記

### 2.6.2 `README.md`

- 「Book name aliases」セクションに以下を追記：
  - 「**Load aliases for current WT Locale** ボタンを使うと、現在の wtlocale に対応するプリセットを一括ロードできる」
  - 「wtlocale を切り替えたあとにこのボタンを押すと、言語のエイリアスへ一気に切り替わる」
  - 「手動で編集すると `loadedPreset` が null になり、以降のリセット操作でカスタム扱いに」
- リリースノートの「対応言語」セクションに「Phase 2 リリース時: J（日本語）のみ」と明記

---

## 2.7 影響範囲チェックリスト

- [ ] `src/main.ts` — `loadSettings()` で `loadedPreset` が欠落してる既存ユーザーをカバー（`?? null` で OK）
- [ ] `src/core/constants.ts` — `DEFAULT_SETTINGS.loadedPreset = null` を追加
- [ ] `src/core/settings-utils.ts` — 上記仕様
- [ ] `src/core/aliases-presets.ts` — 新規
- [ ] `src/core/types.ts` — `LocalePreset` 型 + `loadedPreset` フィールド
- [ ] `src/settings.ts` — ボタン置換 + 編集時の `loadedPreset` リセット
- [ ] `data/aliases.json` — 削除（`data/aliases-master.json` に統合）
- [ ] `data/aliases-master.json` — 新規（既存の `data/aliases.json.ja` を `J` キーで移植）
- [ ] `tests/aliases.test.ts` — 追従
- [ ] `tests/settings-utils.test.ts` — 追従
- [ ] `tests/aliases-presets.test.ts` — 新規
- [ ] `docs/ARCHITECTURE.md` — 仕様追記
- [ ] `README.md` — UI 手順追記
- [ ] `docs/spec.md` §5.1 エイリアステーブルの例を更新（構造は変えない、`data/aliases-master.json` の `J` からの抽出例に差し替え）
- [ ] `docs/todo.md` Phase 2 末尾に本タスクへの参照リンクを追加

---

## 2.8 非対象（Phase 3 以降）

- wtlocale のドロップダウン UI
- `bible-book-names-intl` の vendoring スクリプト
- E, G, S, F, I, P, K, C, T 等の追加プリセット
- プリセット単位でのプレビュー / 検索
- マスターデータ更新の自動チェック
