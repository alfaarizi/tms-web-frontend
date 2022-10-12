/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_NAME: string,
        REACT_APP_VERSION: string,
        REACT_APP_LOGIN_METHOD: string,
        REACT_APP_API_BASEURL: string,
        REACT_DEV_PROXY?: string,
        REACT_APP_BACKEND_CORE_VERSION_RANGE: string,
    }
}
