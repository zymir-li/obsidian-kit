import {
    Notice,
    Plugin,
    setIcon,
} from "obsidian";
import { fetchSecret } from "./command-runner";
import { parseSecretBlock, type SecretEntry } from "./parser";
import {
    DEFAULT_SETTINGS,
    SecretCopySettingTab,
    type SecretCopySettings,
} from "./settings";

export default class SecretCopyPlugin extends Plugin {
    settings!: SecretCopySettings;

    async onload(): Promise<void> {
        await this.loadSettings();

        this.registerMarkdownCodeBlockProcessor("secret", (source, element) => {
            this.renderSecretBlock(source, element);
        });

        this.addSettingTab(new SecretCopySettingTab(this.app, this));
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }

    private async loadSettings(): Promise<void> {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData(),
        );
    }

    private renderSecretBlock(source: string, element: HTMLElement): void {
        const container = element.createDiv({ cls: "secret-copy-block" });
        const lines = parseSecretBlock(source, this.settings.defaultMask);

        if (lines.length === 0) {
            container.createDiv({
                cls: "secret-copy-empty",
                text: "空 secret 块。示例：$DB_PASSWORD|数据库密码",
            });
            return;
        }

        for (const line of lines) {
            if (!line.ok) {
                container.createDiv({
                    cls: "secret-copy-error",
                    text: `无法解析：${line.source}`,
                });
                continue;
            }

            this.renderSecretRow(container, line.entry);
        }
    }

    private renderSecretRow(
        container: HTMLElement,
        entry: SecretEntry,
    ): void {
        const row = container.createDiv({ cls: "secret-copy-row" });
        const icon = row.createSpan({ cls: "secret-copy-icon" });
        setIcon(icon, "lock-keyhole");
        row.createSpan({ cls: "secret-copy-label", text: entry.label });

        const button = row.createEl("button", {
            cls: "secret-copy-button",
            text: "复制",
            attr: {
                type: "button",
                "aria-label": `复制 ${entry.key}`,
            },
        });

        this.registerDomEvent(button, "click", async () => {
            button.disabled = true;
            button.setText("取值中…");

            try {
                const value = await fetchSecret(entry.key, this.settings);
                if (!value) {
                    throw new Error("命令返回空值");
                }

                await navigator.clipboard.writeText(value);
                new Notice(`已复制 ${entry.key} 到剪贴板`);
                button.setText("已复制 ✓");
            } catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : String(error);
                new Notice(`${entry.key} 取值失败：${message}`);
                button.setText("失败");
            } finally {
                window.setTimeout(() => {
                    button.setText("复制");
                    button.disabled = false;
                }, 1_500);
            }
        });
    }
}
