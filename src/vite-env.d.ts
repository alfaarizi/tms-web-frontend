/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_NAME: string,
    VITE_VERSION: string,
    VITE_LOGIN_METHOD: string,
    VITE_API_BASE_URL: string,
    VITE_BACKEND_CORE_VERSION_RANGE: string,
    VITE_TIMEOUT_AFTER_FAILED_LOGIN: string,
    VITE_THEME: string,
    VITE_GOOGLE_ANALYTICS_ID?: string,
    VITE_ENV_PREFIX: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
