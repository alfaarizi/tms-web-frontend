import { CodeCheckerReport } from 'resources/common/CodeCheckerReport';
import { CodeCheckerResultStatus } from 'resources/common/CodeCheckerResultStatus';

export interface CodeCheckerResult {
    id: number;
    status: CodeCheckerResultStatus;
    codeCheckerReports: CodeCheckerReport[];
}
