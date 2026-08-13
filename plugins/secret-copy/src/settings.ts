import {
    App,
    Plugin,
    PluginSettingTab,
    Setting,
} from "obsidian";
import {
    DEFAULT_TIMEOUT_MS,
    MAX_TIMEOUT_MS,
    MIN_TIMEOUT_MS,
    normalizeTimeout,
} from "./command-runner";

export interface SecretCopySettings {
    valueCommand: string;
    shellPath: string;
    timeoutMs: number;
    defaultMask: string;
}

export const DEFAULT_SETTINGS: SecretCopySettings = {
    valueCommand: "security find-generic-password -w -s {{KEY}}",
    shellPath: "",
    timeoutMs: DEFAULT_TIMEOUT_MS,
    defaultMask: "••••••",
};

interface SettingsHost {
    settings: SecretCopySettings;
    saveSettings(): Promise<void>;
}

type SettingsPlugin = Plugin & SettingsHost;

const COMMAND_PRESETS: Record<string, string> = {
    keychain: "security find-generic-password -w -s {{KEY}}",
    environment: "printenv {{KEY}}",
    dotenv: "grep '^{{KEY}}=' ~/.secrets.env | cut -d= -f2-",
    onepassword: "op read op://Vault/{{KEY}}/password",
    linux: "secret-tool lookup key {{KEY}}",
};

export class SecretCopySettingTab extends PluginSettingTab {
    constructor(app: App, private readonly host: SettingsPlugin) {
        super(app, host);
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: "Secret Copy" });
        containerEl.createEl("p", {
            cls: "setting-item-description",
            text: "取值命令属于本机受信配置。{{KEY}} 只会被替换为字母、数字或下划线组成的键名。",
        });

        new Setting(containerEl)
            .setName("命令预设")
            .setDesc("选择后会覆盖下面的取值命令。")
            .addDropdown((dropdown) => {
                dropdown.addOption("", "选择预设…");
                dropdown.addOption("keychain", "macOS 钥匙串");
                dropdown.addOption("environment", "环境变量");
                dropdown.addOption("dotenv", ".env 文件");
                dropdown.addOption("onepassword", "1Password CLI");
                dropdown.addOption("linux", "Linux 钥匙串");
                dropdown.onChange(async (value) => {
                    const command = COMMAND_PRESETS[value];
                    if (!command) return;
                    this.host.settings.valueCommand = command;
                    await this.host.saveSettings();
                    this.display();
                });
            });

        new Setting(containerEl)
            .setName("取值命令")
            .setDesc("命令的标准输出会被写入剪贴板；{{KEY}} 会替换为代码块中的键名。")
            .addTextArea((text) => {
                text.setValue(this.host.settings.valueCommand);
                text.inputEl.rows = 3;
                text.inputEl.addClass("secret-copy-command-input");
                text.onChange(async (value) => {
                    this.host.settings.valueCommand = value;
                    await this.host.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName("Shell 路径")
            .setDesc("留空时使用 $SHELL；仍为空则回退到 /bin/zsh。")
            .addText((text) => {
                text.setPlaceholder("/bin/zsh");
                text.setValue(this.host.settings.shellPath);
                text.onChange(async (value) => {
                    this.host.settings.shellPath = value;
                    await this.host.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName("超时（毫秒）")
            .setDesc(`${MIN_TIMEOUT_MS}–${MAX_TIMEOUT_MS}，默认 ${DEFAULT_TIMEOUT_MS}。`)
            .addText((text) => {
                text.inputEl.type = "number";
                text.inputEl.min = String(MIN_TIMEOUT_MS);
                text.inputEl.max = String(MAX_TIMEOUT_MS);
                text.setValue(String(this.host.settings.timeoutMs));
                text.onChange(async (value) => {
                    this.host.settings.timeoutMs = normalizeTimeout(value);
                    await this.host.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName("默认掩码")
            .setDesc("未填写显示名时展示的文本，不会影响真实值。")
            .addText((text) => {
                text.setValue(this.host.settings.defaultMask);
                text.onChange(async (value) => {
                    this.host.settings.defaultMask = value || DEFAULT_SETTINGS.defaultMask;
                    await this.host.saveSettings();
                });
            });
    }
}
