# Codex Obsidian

一套面向中文知识库的 Obsidian 极简视觉覆盖层：弱化界面噪声，统一阅读与编辑版心，并为 Markdown、设置页和可选首页看板提供克制的视觉语言。

> [!IMPORTANT]
> **Base Theme：** [Border](https://github.com/Akifyss/obsidian-border) by [Akifyss](https://github.com/Akifyss)  
> 当前版本基于 Border `1.13.7` 调整，并在 Obsidian `1.13.4`、macOS 上完成验证。仓库不包含或重新分发 Border 源码。

![Codex Obsidian preview](./preview.png)

## 设计重点

- 温暖的纸张色背景，降低纯白界面的刺激感。
- 保留 Obsidian 原生图标、文件选中态和交互语义。
- 文件夹使用正常字重，界面层级依靠颜色和间距而不是粗体堆叠。
- 阅读模式与编辑模式共享 `940px` 内容宽度和一致的水平对齐。
- 标题使用内边距建立节奏，避免破坏 CodeMirror 的标题跳转。
- 引用、Callout、代码块和表格采用轻边框、低对比背景。
- 修复 Border 在收起侧栏、底部状态栏和设置页面中的视觉空白。
- 同时提供浅色与深色变量，并尊重“减少动态效果”系统设置。

## 核心视觉参数

| 元素 | 配置 |
| --- | --- |
| Base 主题 | Border `1.13.7` |
| 界面字体 | `思源宋体 VF` / `Source Han Serif SC VF` |
| 正文字体 | `思源宋体 VF` / `Source Han Serif SC VF` |
| 等宽字体 | `SF Mono` / `SF Mono Light` |
| 正文字号 | `1rem`，跟随 Obsidian 的基础字号设置；预览图为 `16px` |
| 内容宽度 | `940px` |
| 水平留白 | `24px`，窄屏为 `20px` |
| 阅读行高 | `1.66` |
| 编辑行高 | `1.76` |
| 行内代码 / 代码块 | `0.86em`，字重 `300` |
| H1 / H2 / H3 | `1.65em / 1.32em / 1.13em` |
| Callout | `1px` 边框、`8px` 圆角、轻微语义色背景 |

### 配色

| 模式 | 主背景 | 侧栏背景 | 正文 | 强调色 |
| --- | --- | --- | --- | --- |
| 浅色 | `#f3f0e8` | `#ebe7dd` | `#34312d` | `#5969ae` |
| 深色 | `#1b1b1a` | `#161615` | `#e7e2d8` | `#9ca6df` |

## 安装

1. 在 Obsidian 的「设置 → 外观 → 主题」中安装并启用 **Border**。
2. 安装 `思源宋体 VF`。代码字体默认使用 `SF Mono`；其他系统会回退到系统等宽字体。
3. 下载仓库中的 [`codex-obsidian.css`](./codex-obsidian.css)。
4. 将文件放入知识库的 `.obsidian/snippets/`。
5. 在「设置 → 外观 → CSS 代码片段」中启用 `codex-obsidian`。
6. 建议停用会重复修改字体、版心、Callout 或应用边框的其他 snippets。

修改 CSS 后，可在 Obsidian 中关闭再重新启用该 snippet，或重新加载窗口。

## 可选首页看板

CSS 内包含 `dashboard-home` 样式，但仓库不会提供或上传任何个人笔记模板。若要在自己的首页使用这些样式，请在该笔记的属性中添加：

```yaml
cssclasses:
  - dashboard-home
```

看板的内容、链接与 HTML 结构需要由使用者在自己的知识库中维护。

## 说明

- 这是个人视觉覆盖层，不是 Border 的分支，也不是 Obsidian 社区主题商店中的独立主题。
- 字体文件不随仓库分发；未安装指定字体时会使用 CSS 中的回退字体。
- 项目与 OpenAI、Codex、Obsidian 官方均无隶属或背书关系。

## License

本仓库代码采用 [MIT License](./LICENSE)。Base 主题 Border 的版权与许可归其原作者所有。
