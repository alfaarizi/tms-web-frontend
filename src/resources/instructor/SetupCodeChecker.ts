export interface SetupCodeChecker {
    staticCodeAnalysis: boolean;
    staticCodeAnalyzerTool?: string;
    staticCodeAnalyzerInstructions?: string;
    codeCheckerCompileInstructions?: string;
    codeCheckerToggles?: string;
    codeCheckerSkipFile?: string;
    reevaluateStaticCodeAnalysis: boolean;
}
