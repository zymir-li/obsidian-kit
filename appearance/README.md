# Appearance

当前外观组合是 **Baseline 3.2.12 + 两个个人 CSS snippets**。

## 目录

```text
appearance/
├── themes/Baseline/
│   ├── manifest.json
│   ├── theme.css
│   ├── LICENSE.txt
│   └── UPSTREAM.md
└── snippets/
    ├── zymir-obsidian-theme.css
    └── red-graphite-codeblocks.css
```

## 安装

1. 将 `themes/Baseline` 复制到 vault 的 `.obsidian/themes/Baseline`。
2. 将 `snippets/*.css` 复制到 vault 的 `.obsidian/snippets/`。
3. 在 Obsidian「设置 → 外观」中选择 **Baseline**。
4. 启用 `zymir-obsidian-theme` 和 `red-graphite-codeblocks`。
5. 修改文件后，重新切换对应 snippet 或重载 Obsidian 窗口。

这里保存的是当前验证过的本地快照，不会自动跟随上游更新。升级 Baseline 时，应先在 vault 中验证，再整体替换 `theme.css`、`manifest.json` 和版本说明。
