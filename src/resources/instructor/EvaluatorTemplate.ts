export interface EvaluatorTemplate {
    name: string;
    os: string;
    image: string;
    autoTest: boolean,
    compileInstructions?: string;
    runInstructions?: string;
    appType: string;
    port?: number;
    staticCodeAnalysis: boolean;
    staticCodeAnalyzerTool?: string;
    staticCodeAnalyzerInstructions?: string;
    codeCheckerSkipFile?: string;
    codeCheckerCompileInstructions?: string;
    codeCheckerToggles?: string;
}
