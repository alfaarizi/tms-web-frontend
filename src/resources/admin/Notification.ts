export interface Notification {
    id: number;
    message: string;
    startTime: string;
    endTime: string;
    isAvailableForAll: boolean;
    dismissable: boolean;
}
