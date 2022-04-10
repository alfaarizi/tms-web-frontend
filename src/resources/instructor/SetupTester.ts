export interface SetupTester {
    testOS: string;
    showFullErrorMsg: boolean;
    reevaluateAutoTest: boolean;
    imageName?: string;
    compileInstructions: string;
    runInstructions: string;
    files: FileList | null
}
