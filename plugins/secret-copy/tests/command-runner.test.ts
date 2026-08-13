import { describe, expect, it } from "vitest";
import {
    MAX_TIMEOUT_MS,
    MIN_TIMEOUT_MS,
    buildValueCommand,
    fetchSecret,
    normalizeTimeout,
} from "../src/command-runner";

describe("buildValueCommand", () => {
    it("replaces every KEY placeholder", () => {
        expect(buildValueCommand("echo {{KEY}}/{{KEY}}", "API_TOKEN"))
            .toBe("echo API_TOKEN/API_TOKEN");
    });

    it("rejects unsafe keys", () => {
        expect(() => buildValueCommand("echo {{KEY}}", "TOKEN;whoami"))
            .toThrow("非法 KEY");
    });

    it("rejects an empty command", () => {
        expect(() => buildValueCommand("  ", "TOKEN"))
            .toThrow("未配置取值命令");
    });
});

describe("fetchSecret", () => {
    it("executes the trusted command and removes trailing newlines", async () => {
        await expect(fetchSecret("TOKEN", {
            valueCommand: "printf 'secret-value\\n'",
            shellPath: "/bin/sh",
            timeoutMs: 2_000,
        })).resolves.toBe("secret-value");
    });

    it("does not expose command output when execution fails", async () => {
        await expect(fetchSecret("TOKEN", {
            valueCommand: "printf 'sensitive-error' >&2; exit 7",
            shellPath: "/bin/sh",
            timeoutMs: 2_000,
        })).rejects.toThrow("取值命令失败（退出码 7）");
    });
});

describe("normalizeTimeout", () => {
    it("clamps values to the supported range", () => {
        expect(normalizeTimeout(0)).toBe(MIN_TIMEOUT_MS);
        expect(normalizeTimeout(999_999)).toBe(MAX_TIMEOUT_MS);
    });
});
