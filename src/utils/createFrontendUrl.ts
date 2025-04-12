export function createFrontendUrl(url: string) {
    const base = import.meta.env.BASE_URL.replace(/\/+$/, ''); // removes trailing slash
    return `${base}/${url}`;
}
