export interface Notification {
    id: number;
    message: string;
    startTime: string;
    endTime: string;
    scope?: 'everyone' | 'user' | 'student' | 'faculty';
    dismissable: boolean;
}
