# NWT Linker

NWT Linker 是一款 Obsidian 社区插件，可将圣经经文参考转换为可在 JW Library 或 jw.org 打开《新世界译本》的链接。

在笔记中输入圣经书名与章节参考，插件就会将其转换为打开《新世界译本》对应经文的链接。

## 功能

- 输入时自动将圣经经文参考转为链接
- 生成 jw.org 的《新世界译本》链接
- 当 JW Library 可用时会打开 JW Library，否则改用 jw.org
- 支持可配置的书名别名
- 从 WT Locale 预设组合加载书名别名
- 以 JSON 格式添加、编辑、删除、导入及导出别名
- 跟踪别名是来自预设组合还是经过自定义编辑
- 可设置语言区域、出版物与 URL 模板
- 在停止输入后经过短暂延迟才转换，避免干扰编辑

## 使用方法

输入圣经经文参考，例如：

```text
提多书1:14
```

转换后会变成如下链接：

```md
[提多书 1:14](https://www.jw.org/finder?srcid=jwlshare&wtlocale=CHS&prefer=lang&bible=56001014&pub=nwtsty)
```

书名与章节之间有空格也可以使用：

```text
提多书 1:14
```

## 书名别名

你可以为每本圣经书名设置别名。别名会根据你的 **WT Locale** 设置，从对应的预设组合中加载。

例如，简体中文（`CHS`）预设组合包含如下别名：

- `创世记`, `创` → 创世记
- `诗篇`, `诗` → 诗篇
- `提多书`, `提多` → 提多书
- `约翰福音`, `约` → 约翰福音

这让你可以使用自己习惯的简称来转换经文参考。

在设置画面的 **Book name aliases** 中，你可以：

- 添加别名
- 更改现有别名对应的书名编号
- 删除别名
- 以 JSON 导入或导出别名
- **Load aliases for current WT Locale**：以当前 WT Locale 设置对应的预设组合替换当前别名（例如 `CHS — 中文（简体）`）。

### 自定义别名与重新加载预设组合

当你添加、编辑、删除或导入别名后，别名列表会进入 **custom** 状态。设置画面会显示当前的列表是来自预设组合，还是经过自定义编辑。

若你处于 custom 状态并选择 **Load aliases for current WT Locale**，将会显示确认对话框，避免你不小心覆盖自定义别名。若当前语言区域的预设组合已经加载，则会立即重新加载。

### 申请新的语言区域预设组合

如果你需要支持尚未收录的 WT Locale，请在 [GitHub](https://github.com/jwnetdotwork/nwt-linker) 上提交 Issue 或 Pull Request。

## 设置

你可以在设置画面中调整以下选项：

- 启用或停用转换
- 停止输入后转换前的等待时间
- 要打开的出版物语言区域
- 要打开的出版物
- URL 模板

若你使用其他 WT Locale，请将语言区域设置更改为符合你语言的代码。

## 安装方式

### 手动安装

1. 打开 GitHub 的 [Release 页面](https://github.com/jwnetdotwork/nwt-linker/releases)，从最新版本下载 `main.js` 与 `manifest.json`。
2. 将这两个文件放到你的 Vault 中的以下文件夹：

```text
<Vault>/.obsidian/plugins/nwt-linker/
```

3. 重新加载 Obsidian，并在**设置 → 社区插件**中启用 NWT Linker。

## 补充

- 支持的 WT Locale 预设组合：
  - 日文（`J`）
  - 英文（`E`）
  - 西班牙文（`S`）
  - 繁体中文（`CH`）
  - 简体中文（`CHS`）
  - 巴西葡萄牙文（`T`）
  - 法文（`F`）
  - 德文（`X`）
  - 韩文（`KO`）
  - 意大利文（`I`）
  - 俄文（`U`）
- 如果设置的 WT Locale 没有对应的预设组合，首次设置时会回退到日文（`J`）预设组合。
- 这是一款 Obsidian 社区插件。
- 默认状态下可离线运作。
- 遵循 jw.org 的使用规范，不会进行内容抓取。
- 经文参考转换完全在你的笔记内完成。
- 如何查询你的 WT Locale
  - 用你的语言建立一个分享链接，并寻找 `wtlocale=` 参数。其后的大写字母就是你的 WT Locale。
  - 例如：`https://www.jw.org/finder?srcid=jwlshare&wtlocale=CHS&prefer=lang&bible=40024045&pub=nwtsty` 这个分享链接的 WT Locale 是 `CHS`。
