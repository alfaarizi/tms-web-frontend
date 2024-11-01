export function extractUserCodes(value: string): string[] {
    return value.split(' ')
        .filter((code) => code !== '')
        .filter((v, i, a) => a.indexOf(v) === i);
}
