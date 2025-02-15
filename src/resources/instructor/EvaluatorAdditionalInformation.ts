import { EvaluatorTemplate } from '@/resources/instructor/EvaluatorTemplate';
import { StaticAnalyzerTool } from '@/resources/instructor/StaticAnalyzerTool';

export interface OsMap {
    [key: string]: string
}

export interface EvaluatorAdditionalInformation {
    templates: EvaluatorTemplate[];
    osMap: OsMap;
    appTypes: string[];
    imageSuccessfullyBuilt: boolean;
    imageCreationDate: string;
    supportedStaticAnalyzers: StaticAnalyzerTool[];
}
