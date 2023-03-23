export interface SetupAutoTester {
    autoTest: boolean,
    showFullErrorMsg: boolean;
    reevaluateAutoTest: boolean;
    compileInstructions?: string;
    runInstructions?: string;
    appType: string;
    port?: number;
}
