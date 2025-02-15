import { CodeCheckerReport } from '@/resources/common/CodeCheckerReport';
import { CodeCheckerResultStatus } from '@/resources/common/CodeCheckerResultStatus';

export interface CodeCheckerResult {
    id: number;
    status: CodeCheckerResultStatus;
    translatedStatus: string;
    codeCheckerReports: CodeCheckerReport[];
    stdout: string;
    stderr: string;
    runnerErrorMessage: string;
}
