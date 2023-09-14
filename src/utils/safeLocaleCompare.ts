export function safeLocaleCompare(a: string | null | undefined, b: string | null | undefined): number {
    if (!a && !b) {
        return 0;
    }
    if (!a || !b) {
        return a ? -1 : 1;
    }
    return a.localeCompare(b);
}
