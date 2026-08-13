import { execFile } from "child_process";
import { SECRET_KEY_PATTERN } from "./parser";

export const DEFAULT_TIMEOUT_MS = 15_000;
export const MIN_TIMEOUT_MS = 1_000;
export const MAX_TIMEOUT_MS = 120_000;

export interface CommandSettings {
    valueCommand: string;
    shellPath: string;
    timeoutMs: number;
}

export function normalizeTimeout(value: unknown): number {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return DEFAULT_TIMEOUT_MS;
    return Math.min(
        MAX_TIMEOUT_MS,
        Math.max(MIN_TIMEOUT_MS, Math.round(numeric)),
    );
}

export function buildValueCommand(template: string, key: string): string {
    if (!SECRET_KEY_PATTERN.test(key)) {
        throw new Error("非法 KEY：只允许字母、数字和下划线");
    }

    const commandTemplate = template.trim();
    if (!commandTemplate) {
        throw new Error("未配置取值命令，请先打开插件设置");
    }

    return commandTemplate.split("{{KEY}}").join(key);
}

export function fetchSecret(
    key: string,
    settings: CommandSettings,
): Promise<string> {
    const command = buildValueCommand(settings.valueCommand, key);
    const shell = settings.shellPath.trim()
        || process.env.SHELL
        || "/bin/zsh";
    const timeout = normalizeTimeout(settings.timeoutMs);

    return new Promise((resolve, reject) => {
        execFile(
            shell,
            ["-lc", command],
            {
                timeout,
                encoding: "utf8",
                maxBuffer: 64 * 1024,
                windowsHide: true,
            },
            (error, stdout) => {
                if (error) {
                    if (error.killed) {
                        reject(new Error("取值命令执行超时"));
                    } else if (error.code === "ENOENT") {
                        reject(new Error("无法启动配置的 Shell"));
                    } else {
                        reject(new Error(`取值命令失败（退出码 ${String(error.code)}）`));
                    }
                    return;
                }

                resolve(stdout.replace(/\n+$/, ""));
            },
        );
    });
}
