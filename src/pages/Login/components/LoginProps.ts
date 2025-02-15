import { ValidationErrorBody } from '@/exceptions/ServerSideValidationError';

/**
 * Generic props interface that can be used for all login forms.
 * TLoginFormData is the type of the submitted login resource.
 */
export interface LoginProps<TLoginFormData> {
    onLogin: (data: TLoginFormData) => void,
    isLoading: boolean,
    serverSideError: ValidationErrorBody | null
}
