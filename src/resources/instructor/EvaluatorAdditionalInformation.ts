import { EvaluatorTemplate } from 'resources/instructor/EvaluatorTemplate';

export interface OsMap {
    [key: string]: string
}

export interface EvaluatorAdditionalInformation {
    templates: EvaluatorTemplate[];
    osMap: OsMap;
    appTypes: string[],
    imageSuccessfullyBuilt: boolean;
    imageCreationDate: string;
}
