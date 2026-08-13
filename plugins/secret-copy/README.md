# Secret Copy

在 Obsidian 笔记里只保存密钥引用；阅读模式显示标签或掩码，点击复制时才从本机受信来源读取真实值。

## 写法

````markdown
```secret
$DB_PASSWORD|数据库密码
$AWS_SECRET_KEY|AWS 密钥
$API_TOKEN
```
````

- `$KEY|显示名`：显示名称和复制按钮。
- `$KEY`：显示默认掩码。
- KEY 只允许字母、数字和下划线。

## 工作方式

```text
Markdown 引用 → 阅读模式按钮 → 本地命令 → 内存 → 系统剪贴板
```

- 不修改 Markdown 文件。
- 不把真实值写入 DOM。
- 不预取或缓存真实值。
- 只有明确点击复制时才执行本地命令。

## 取值来源

插件设置中的 `{{KEY}}` 会替换为代码块里的 KEY。预设包括：

| 来源 | 命令 |
| --- | --- |
| macOS 钥匙串 | `security find-generic-password -w -s {{KEY}}` |
| 环境变量 | `printenv {{KEY}}` |
| `.env` 文件 | `grep '^{{KEY}}=' ~/.secrets.env \| cut -d= -f2-` |
| 1Password CLI | `op read op://Vault/{{KEY}}/password` |
| Linux 钥匙串 | `secret-tool lookup key {{KEY}}` |

例如写入 macOS 钥匙串：

```bash
security add-generic-password -a "$USER" -s DB_PASSWORD -w 'your-secret' -U
```

## 安装

### 从构建产物安装

把以下文件复制到 `<vault>/.obsidian/plugins/secret-copy/`：

- `main.js`
- `manifest.json`
- `styles.css`

重启 Obsidian，然后在「设置 → 第三方插件」中启用 **Secret Copy**。

### 开发

需要 Node.js 20 或更高版本。

```bash
npm install
npm run check
```

`npm run build` 会在当前目录生成 `main.js`。

## 安全说明

取值命令会通过登录 shell 执行，因此它拥有当前用户的本机权限。插件只限制插入命令的 KEY，无法判断你手动填写的命令是否安全。只使用自己理解和信任的命令。

真实值会进入系统剪贴板，仍可能被剪贴板历史工具、其他应用或后续粘贴操作读取。插件不会自动清空剪贴板。

当前命令执行模型面向 macOS 和 Linux 的登录 shell；Windows 尚未验证。
