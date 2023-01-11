import { PlagiarismBasefile } from 'resources/instructor/PlagiarismBasefile';
import { ValidationErrorBody } from 'exceptions/ServerSideValidationError';

export interface BaseFileUploadResult {
    uploaded: PlagiarismBasefile[];
    failed: {
        name: string,
        cause: ValidationErrorBody
    }[]
}
