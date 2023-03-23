export enum SeverityOrder {
    Unspecified,
    Style,
    Low,
    Medium,
    High,
    Critical,
}

export type Severity = 'Unspecified' | 'Style' | 'Low' | 'Medium' | 'High' | 'Critical';

export interface CodeCheckerReport {
    id: number;
    resultId: number;
    filePath: string;
    line: number;
    column: number;
    checkerName: string;
    analyzerName: string;
    severity: Severity;
    translatedSeverity: string;
    category: string;
    message: string;
    viewerLink: string;
}
