import { useTranslation } from 'react-i18next';
import { Validate } from 'react-hook-form';

/**
 * Provides functions to validate the total size of the uploaded files.
 * The maximum size is loaded from an environmental variable.
 */
export function useFileSizeValidator() {
    const { t } = useTranslation();
    const maxSizeInMiB: number = parseInt(process.env.REACT_APP_UPLOAD_MAX_FILESIZE, 10);
    const maxSizeInBytes: number = maxSizeInMiB * 1024 * 1024;

    /**
     * Determines if the total size of the uploaded files is less than the global file size limit
     * @param files
     */
    const validate = (files: FileList | null): boolean => {
        if (!files) {
            return true;
        }

        let sizeSum: number = 0;
        for (let i = 0; i < files.length; i++) {
            sizeSum += files[i].size;
            if (sizeSum > maxSizeInBytes) {
                return false;
            }
        }

        return true;
    };

    /**
     * Wraps validate in a react-hook-form validator function
     * @param files
     */
    const reactHookFormsValidator: Validate<FileList | null> = (files) => (
        validate(files) || t('fileUpload.sizeLimitError', { maxSize: maxSizeInMiB }).toString()
    );

    return {
        validate,
        reactHookFormsValidator,
        maxSizeInBytes,
        maxSizeInMiB,
    };
}
