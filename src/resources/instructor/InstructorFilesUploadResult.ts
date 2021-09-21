import { InstructorFile } from 'resources/common/InstructorFile';
import { ValidationErrorBody } from 'exceptions/ServerSideValidationError';

export interface InstructorFilesUploadResult {
    uploaded: InstructorFile[];
    failed: {
        name: string,
        cause: ValidationErrorBody
    }[]
}
