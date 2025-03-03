import { Image } from 'resources/common/Image';
import { ValidationErrorBody } from 'exceptions/ServerSideValidationError';

export interface QuizImageUploadResult {
    uploaded: Image[];
    failed: {
        name: string,
        cause: ValidationErrorBody
    }[]
}
