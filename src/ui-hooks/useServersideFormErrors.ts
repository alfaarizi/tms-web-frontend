import { useEffect } from 'react';
import { ValidationErrorBody } from 'exceptions/ServerSideValidationError';
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form/dist/types/form';
import { FieldValues } from 'react-hook-form/dist/types/fields';

/**
 * Extracts field validation errors from responses with status code 422
 * @param clearErrors clearErrors function from React Hook Form
 * @param setError setError function from React Hook Form
 * @param serverSideError response body
 */
export function useServersideFormErrors<TFieldValues extends FieldValues>(
    clearErrors: UseFormClearErrors<TFieldValues>,
    setError: UseFormSetError<TFieldValues>,
    serverSideError: ValidationErrorBody | null | undefined,
) {
    useEffect(() => {
        if (serverSideError) {
            const keys: string[] = Object.keys(serverSideError);
            keys.forEach((key: any) => {
                clearErrors(key);
                if (!!serverSideError[key] && Array.isArray(serverSideError[key]) && serverSideError[key].length > 0) {
                    setError(key, { message: serverSideError[key][0] });
                }
            });
        }
    }, [serverSideError]);
}
