import JSZip from 'jszip';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Creates a zip file from the contents of a file upload field
 */
export function useSolutionZipFileCreator() {
    const [uploadHintMsg, setUploadHintMsg] = useState<string | undefined>(undefined);
    const [disableUpload, setDisableUpload] = useState<boolean>(false);
    const { t } = useTranslation();

    const setHintMessagesForFilesToBeUploaded = async (files: File[]) => {
        const isContainsDllOrExe = files.some((file) => file.name.endsWith('.dll') || file.name.endsWith('.exe'));
        if (isContainsDllOrExe) {
            setUploadHintMsg(t('fileUpload.hint.dllExeNotAllowed'));
            setDisableUpload(true);
            return;
        }

        if (files.length > 1) {
            const isAllFilesZip = files.every((file) => file.type.includes('zip'));
            if (isAllFilesZip) {
                setUploadHintMsg(t('fileUpload.hint.zipOnly'));
                setDisableUpload(false);
                return;
            }
        }

        const file = files[0];
        if (files.length === 1 && file.type.includes('zip')) {
            // extract files from zip and check if there are any .dll or .exe files or .git folder
            const zip = new JSZip();
            const zipContent = await zip.loadAsync(file);
            const fileNames = Object.keys(zipContent.files);
            const isContainsDllOrExeInZip = fileNames.some((fileName) => fileName.endsWith('.dll')
                || fileName.endsWith('.exe'));
            const isContainsGitFolder = fileNames.some((fileName) => fileName.startsWith('.git/'));
            if (isContainsDllOrExeInZip) {
                setUploadHintMsg(t('fileUpload.hint.dllExeNotAllowed'));
                setDisableUpload(true);
                return;
            }
            if (isContainsGitFolder) {
                setUploadHintMsg(t('fileUpload.hint.gitFolderNotAllowed'));
                setDisableUpload(true);
                return;
            }
        }
        if (!file.type.includes('zip')) {
            setUploadHintMsg(t('fileUpload.hint.willBeZipped'));
            setDisableUpload(false);
            return;
        }

        setUploadHintMsg(undefined);
        setDisableUpload(false);
    };

    const zipFilesIfNeeded = useCallback(async (files: File[]) => {
        if (files.length === 1 && files[0].type.includes('zip')) {
            return files[0];
        }

        const zip = new JSZip();

        files.forEach((file) => {
            zip.file(`${file.name}`, file);
        });

        const zippedFiles = await zip.generateAsync({ type: 'blob' });
        // return zipped files as File
        return new File([zippedFiles], 'solution.zip', { type: 'application/zip' });
    }, []);

    const handleChangedFiles = useCallback(async (files: File[]) => {
        await setHintMessagesForFilesToBeUploaded(files);
    }, []);

    return {
        uploadHintMsg,
        disableUpload,
        zipFilesIfNeeded,
        handleChangedFiles,
    };
}
