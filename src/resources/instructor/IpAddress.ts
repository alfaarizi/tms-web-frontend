import { Submission } from 'resources/instructor/Submission';

export interface IpAddress {
    id: number;
    activity: string;
    translatedActivity: string;
    logTime: string;
    ipAddress: string;
    submission?: Submission;
}
