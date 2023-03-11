export type NotificationTarget = 'official' | 'custom' | 'none';

export interface UserSettings {
    name: string;
    neptun: string;
    email: string;
    customEmail: string | null;
    locale: string;
    isStudent: boolean;
    isFaculty: boolean;
    isAdmin: boolean;
    customEmailConfirmed: boolean;
    notificationTarget: NotificationTarget;
}
