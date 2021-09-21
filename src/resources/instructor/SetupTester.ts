export interface SetupTester {
    testOS: string;
    showFullErrorMsg: boolean;
    imageName?: string;
    compileInstructions: string;
    runInstructions: string;
    files: FileList | null
}
