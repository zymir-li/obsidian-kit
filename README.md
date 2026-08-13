# Obsidian Kit

个人 Obsidian 外观配置与插件源码仓库。这里保存可公开、可重建的定制内容，不保存 vault 笔记、工作区状态或任何真实密钥。

## 内容

```text
.
├── appearance/
│   ├── themes/Baseline/       # 当前使用的 Baseline 主题快照
│   └── snippets/              # 在 Baseline 之上的个人 CSS
└── plugins/
    └── secret-copy/           # secret 代码块安全复制插件
```

### Appearance

- Baseline `3.2.12`
- `zymir-obsidian-theme.css`
- `red-graphite-codeblocks.css`

安装与启用顺序见 [`appearance/README.md`](./appearance/README.md)。

### Secret Copy

在 Markdown 中用 `secret` 代码块保存密钥引用，阅读模式只显示标签或掩码。点击复制时，插件才通过本地命令从 macOS 钥匙串、环境变量或密码管理器读取真实值。

插件源码、构建与安装说明见 [`plugins/secret-copy/README.md`](./plugins/secret-copy/README.md)。

## 安全边界

- 仓库不包含真实密钥。
- 插件的 `data.json`、依赖目录和本地日志不会进入 Git。
- `Secret Copy` 的取值命令是本机受信配置；不要粘贴来源不明的命令。
- 构建产物 `main.js` 会纳入版本控制，方便手动安装，但应始终由仓库源码构建。

## License

个人代码和 CSS 使用根目录的 [MIT License](./LICENSE)。

Baseline 由 [aaaaalexis/obsidian-baseline](https://github.com/aaaaalexis/obsidian-baseline) 提供，快照保留其原始版权和 MIT 许可，见 [`appearance/themes/Baseline/LICENSE.txt`](./appearance/themes/Baseline/LICENSE.txt)。
