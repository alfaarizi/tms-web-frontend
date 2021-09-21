import { Image } from 'resources/common/Image';
import { ValidationErrorBody } from 'exceptions/ServerSideValidationError';

export interface ExamImageUploadResult {
    uploaded: Image[];
    failed: {
        name: string,
        cause: ValidationErrorBody
    }[]
}
