import { User } from 'resources/common/User';
import { ValidationErrorBody } from 'exceptions/ServerSideValidationError';

interface Failed {
    neptun: string;
    cause: ValidationErrorBody;
}

export interface UserAddResponse {
    addedUsers: User[];
    failed: Failed[];
}
