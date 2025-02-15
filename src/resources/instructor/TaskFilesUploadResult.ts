import { TaskFile } from '@/resources/common/TaskFile';
import { ValidationErrorBody } from '@/exceptions/ServerSideValidationError';

export interface TaskFilesUploadResult {
    uploaded: TaskFile[];
    failed: {
        name: string,
        cause: ValidationErrorBody
    }[]
}
