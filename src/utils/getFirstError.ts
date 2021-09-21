import { ValidationErrorBody } from 'exceptions/ServerSideValidationError';

export function getFirstError(errors: ValidationErrorBody): string | null {
    const keys = Object.keys(errors);
    if (keys.length > 0 && errors[keys[0]] && errors[keys[0]][0]) {
        return errors[keys[0]][0];
    }
    return null;
}
