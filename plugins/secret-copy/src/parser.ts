export const SECRET_KEY_PATTERN = /^[A-Za-z0-9_]+$/;

export interface SecretEntry {
    key: string;
    label: string;
}

export type ParsedSecretLine =
    | { ok: true; entry: SecretEntry }
    | { ok: false; source: string };

export function parseSecretLine(
    rawLine: string,
    defaultMask: string,
): SecretEntry | null {
    const source = rawLine.trim();
    if (!source) return null;

    // The leading dollar sign is recommended but remains optional for
    // compatibility with the original plugin build.
    const content = source.startsWith("$") ? source.slice(1) : source;
    const separatorIndex = content.indexOf("|");
    const key = (
        separatorIndex === -1
            ? content
            : content.slice(0, separatorIndex)
    ).trim();
    const explicitLabel = separatorIndex === -1
        ? ""
        : content.slice(separatorIndex + 1).trim();

    if (!SECRET_KEY_PATTERN.test(key)) return null;

    return {
        key,
        label: explicitLabel || defaultMask,
    };
}

export function parseSecretBlock(
    source: string,
    defaultMask: string,
): ParsedSecretLine[] {
    const parsed: ParsedSecretLine[] = [];

    for (const rawLine of source.split(/\r?\n/)) {
        const trimmed = rawLine.trim();
        if (!trimmed) continue;

        const entry = parseSecretLine(trimmed, defaultMask);
        parsed.push(entry
            ? { ok: true, entry }
            : { ok: false, source: trimmed });
    }

    return parsed;
}
