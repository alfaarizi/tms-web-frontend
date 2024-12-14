export interface Notification {
    id: number;
    groupID: number;
    message: string;
    startTime: string;
    endTime: string;
    dismissible: boolean;
}
