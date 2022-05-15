import { TesterTemplate } from 'resources/instructor/TesterTemplate';

export interface OsMap {
    [key: string]: string
}

export interface TesterFormData {
    templates: TesterTemplate[];
    osMap: OsMap;
    appTypes: string[],
    imageSuccessfullyBuilt: boolean;
    imageCreationDate: string;
}
