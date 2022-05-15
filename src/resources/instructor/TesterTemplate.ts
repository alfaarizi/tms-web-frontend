export interface TesterTemplate {
    name: string;
    os: string;
    image: string;
    compileInstructions: string;
    runInstructions: string;
    appType: string;
    port?: number;
}
