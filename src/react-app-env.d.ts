/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_LOGIN_METHOD: string,
        REACT_APP_API_BASEURL: string,
        REACT_DEV_PROXY?: string,
        REACT_APP_UPLOAD_MAX_FILESIZE: string,
    }
}
