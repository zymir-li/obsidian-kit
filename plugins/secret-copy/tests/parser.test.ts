import { describe, expect, it } from "vitest";
import { parseSecretBlock, parseSecretLine } from "../src/parser";

describe("parseSecretLine", () => {
    it("parses a key and display label", () => {
        expect(parseSecretLine("$DB_PASSWORD|数据库密码", "••••••"))
            .toEqual({ key: "DB_PASSWORD", label: "数据库密码" });
    });

    it("uses the default mask when the label is missing", () => {
        expect(parseSecretLine("$API_TOKEN", "******"))
            .toEqual({ key: "API_TOKEN", label: "******" });
    });

    it("keeps compatibility with a missing dollar prefix", () => {
        expect(parseSecretLine("API_TOKEN|令牌", "******"))
            .toEqual({ key: "API_TOKEN", label: "令牌" });
    });

    it("rejects characters that could alter a shell command", () => {
        expect(parseSecretLine("$TOKEN;whoami|bad", "******")).toBeNull();
        expect(parseSecretLine("$TOKEN-NAME|bad", "******")).toBeNull();
    });
});

describe("parseSecretBlock", () => {
    it("ignores blank lines and reports invalid rows", () => {
        expect(parseSecretBlock("\n$GOOD\n$BAD-NAME\n", "mask"))
            .toEqual([
                { ok: true, entry: { key: "GOOD", label: "mask" } },
                { ok: false, source: "$BAD-NAME" },
            ]);
    });
});
