# NWT Linker

NWT Linker 是一款 Obsidian 社群插件，可將聖經經文參考轉換為可在 JW Library 或 jw.org 開啟《新世界譯本》的連結。

在筆記中輸入聖經書名與章節參考，插件就會將其轉換為開啟《新世界譯本》對應經文的連結。

## 功能

- 輸入時自動將聖經經文參考轉為連結
- 生成 jw.org 的《新世界譯本》連結
- 當 JW Library 可用時會開啟 JW Library，否則改用 jw.org
- 支援可設定的書名別名
- 從 WT Locale 預設組合載入書名別名
- 以 JSON 格式新增、編輯、刪除、匯入及匯出別名
- 追蹤別名是來自預設組合或經過自訂編輯
- 可設定語言地區、出版物與 URL 範本
- 在停止輸入後經過短暫延遲才轉換，避免干擾編輯

## 使用方法

輸入聖經經文參考，例如：

```text
提多書1:14
```

轉換後會變成如下連結：

```md
[提多書 1:14](https://www.jw.org/finder?srcid=jwlshare&wtlocale=CH&prefer=lang&bible=56001014&pub=nwtsty)
```

書名與章節之間有空格也可以使用：

```text
提多書 1:14
```

## 書名別名

你可以為每本聖經書名設定別名。別名會根據你的 **WT Locale** 設定，從對應的預設組合中載入。

例如，繁體中文（`CH`）預設組合包含如下別名：

- `創世記`, `創` → 創世記
- `詩篇`, `詩` → 詩篇
- `提多書`, `提多` → 提多書
- `約翰福音`, `約` → 約翰福音

這讓你可以使用自己習慣的簡稱來轉換經文參考。

在設定畫面的 **Book name aliases** 中，你可以：

- 新增別名
- 變更現有別名對應的書名編號
- 刪除別名
- 以 JSON 匯入或匯出別名
- **Load aliases for current WT Locale**：以目前 WT Locale 設定對應的預設組合取代目前別名（例如 `CH — 中文（繁體）`）。

### 自訂別名與重新載入預設組合

當你新增、編輯、刪除或匯入別名後，別名清單會進入 **custom** 狀態。設定畫面會顯示目前的清單是來自預設組合，還是經過自訂編輯。

若你處於 custom 狀態並選擇 **Load aliases for current WT Locale**，將會顯示確認對話框，避免你不小心覆蓋自訂別名。若目前語言地區的預設組合已經載入，則會立即重新載入。

### 申請新的語言地區預設組合

如果你需要支援尚未收錄的 WT Locale，請在 [GitHub](https://github.com/jwnetdotwork/nwt-linker) 上提交 Issue 或 Pull Request。

## 設定

你可以在設定畫面中調整以下選項：

- 啟用或停用轉換
- 停止輸入後轉換前的等待時間
- 要開啟的出版物語言地區
- 要開啟的出版物
- URL 範本

若你使用其他 WT Locale，請將語言地區設定更改為符合你語言的代碼。

## 安裝方式

### 手動安裝

1. 開啟 GitHub 的 [Release 頁面](https://github.com/jwnetdotwork/nwt-linker/releases)，從最新版本下載 `main.js` 與 `manifest.json`。
2. 將這兩個檔案放到你的 Vault 中的以下資料夾：

```text
<Vault>/.obsidian/plugins/nwt-linker/
```

3. 重新載入 Obsidian，並在**設定 → 社群插件**中啟用 NWT Linker。

## 補充

- 支援的 WT Locale 預設組合：
  - 日文（`J`）
  - 英文（`E`）
  - 西班牙文（`S`）
  - 繁體中文（`CH`）
  - 簡體中文（`CHS`）
  - 巴西葡萄牙文（`T`）
  - 法文（`F`）
  - 德文（`X`）
  - 韓文（`KO`）
  - 義大利文（`I`）
  - 俄文（`U`）
- 如果設定的 WT Locale 沒有對應的預設組合，首次設定時會退回日文（`J`）預設組合。
- 這是一款 Obsidian 社群插件。
- 預設狀態下可離線運作。
- 遵循 jw.org 的使用規範，不會進行內容抓取。
- 經文參考轉換完全在你的筆記內完成。
- 如何查詢你的 WT Locale
  - 用你的語言建立一個分享連結，並尋找 `wtlocale=` 參數。其後的大寫字母就是你的 WT Locale。
  - 例如：`https://www.jw.org/finder?srcid=jwlshare&wtlocale=CH&prefer=lang&bible=40024045&pub=nwtsty` 這個分享連結的 WT Locale 是 `CH`。
