const PREFIX = process.env.REACT_APP_ENV_PREFIX || '';

export const ACCESS_TOKEN_LOCAL_STORAGE_KEY = `${PREFIX}accessToken`;
export const IMAGE_TOKEN_LOCAL_STORAGE_KEY = `${PREFIX}imageToken`;
export const INSTRUCTOR_TASK_VIEW_LOCAL_STORAGE_KEY = `${PREFIX}instructorTaskView`;
export const INSTRUCTOR_GROUP_VIEW_LOCAL_STORAGE_KEY = `${PREFIX}instructorGroupView`;
export const PROXY_AUTH_REDIRECT_LOCAL_STORAGE_KEY = `${PREFIX}proxyAuthRedirect`;
export const DISMISSED_NOTIFICATIONS_LOCAL_STORAGE_KEY = `${PREFIX}dismissedNotifications`;
