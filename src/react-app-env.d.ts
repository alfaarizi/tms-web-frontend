/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_NAME: string,
        REACT_APP_VERSION: string,
        REACT_APP_LOGIN_METHOD: string,
        REACT_APP_API_BASEURL: string,
        REACT_DEV_PROXY?: string,
        REACT_APP_BACKEND_CORE_VERSION_RANGE: string,
        REACT_APP_TIMEOUT_AFTER_FAILED_LOGIN: string,
        REACT_APP_THEME: string,
        REACT_APP_GOOGLE_ANALYTICS_ID?: string,
    }
}
