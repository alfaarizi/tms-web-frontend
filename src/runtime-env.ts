declare global {
    interface Window {
        env: any
    }
}

// change with your own variables
type EnvType = {
    REACT_APP_LOGIN_METHOD: string,
    REACT_APP_API_BASEURL: string,
    REACT_APP_THEME: string,
    REACT_APP_GOOGLE_ANALYTICS_ID?: string,
}
export const env: EnvType = { ...process.env, ...window.env };
