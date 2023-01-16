import { useTranslation } from 'react-i18next';
import { usePrivateSystemInfoQuery } from 'hooks/common/SystemHooks';

/**
 * Provides functions to validate the total size of the uploaded files.
 * The maximum size is loaded from the private system information.
 */
export function useFileSizeValidator() {
    const { t } = useTranslation();
    const privateSystemInfo = usePrivateSystemInfoQuery();
    const { isSuccess: ready } = privateSystemInfo;
    const maxSizeInBytes = ready ? Math.min(
        privateSystemInfo.data!.uploadMaxFilesize,
        privateSystemInfo.data!.postMaxSize,
    ) : 0;
    const maxSizeInMiB = maxSizeInBytes / 1024 / 1024;

    /**
     * Determines if the total size of the uploaded files is less than the global file size limit
     * @param files
     */
    const validate = (files: FileList | null): boolean => {
        if (!ready) {
            throw new Error('Private system info is not available');
        }

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
    const reactHookFormsValidator = (files: FileList | null) => {
        if (!ready) {
            throw new Error('Private system info is not available');
        }

        return validate(files) || t('fileUpload.sizeLimitError', { maxSize: maxSizeInMiB }).toString();
    };

    return {
        ready,
        validate,
        reactHookFormsValidator,
        maxSizeInBytes,
        maxSizeInMiB,
    };
}
