import React, {
    ChangeEventHandler, MouseEventHandler, useState,
} from 'react';
import {
    Alert, Button, Form, Spinner,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { ErrorAlert } from 'components/ErrorAlert';
import { useFileSizeValidator } from 'ui-hooks/useFileSizeValidator';
import { FormError } from 'components/FormError';

type Props = {
    multiple: boolean,
    loading: boolean,
    onUpload: (files: File[]) => void,
    accept?: string,
    errorMessages?: string[],
    successCount?: number,
    hintMessage?: string
}

/**
 * A file uploader component that can be used outside of forms
 * @param loading Indicates if upload is in progress
 * @param multiple Enable multiple files to upload
 * @param onUpload A callback function to handle upload
 * @param accept Accepted file extensions
 * @param successCount Number of successfully uploaded files
 * @param errorMessages Error messages (e.g. validation messages from the server)
 * @constructor
 */
export function FileUpload({
    loading,
    multiple,
    onUpload,
    accept,
    errorMessages = [],
    successCount,
    hintMessage,
}: Props) {
    const { t } = useTranslation();
    const fileSizeValidator = useFileSizeValidator();
    const [fileList, setFileList] = useState<File[]>([]);
    const [validSize, setValidSize] = useState<boolean>(true);

    const handleUpload: MouseEventHandler<HTMLInputElement> = (evt) => {
        evt.preventDefault();

        onUpload(fileList);
        setFileList([]);
    };

    const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
        const { files } = evt.target;
        if (!files) {
            return;
        }
        setValidSize(fileSizeValidator.validate(files));

        const newFileList: File[] = [];
        for (let i = 0; i < files.length; ++i) {
            newFileList.push(files[i]);
        }
        setFileList(newFileList);

        // eslint-disable-next-line no-param-reassign
        evt.target.value = '';
        // eslint-disable-next-line no-param-reassign
        evt.target.files = null;
    };

    // Render

    // Build file label text from the file list
    let fileLabel: string = '';
    if (fileList.length > 0) {
        fileLabel = fileList[0].name;
        for (let i = 1; i < fileList.length; ++i) {
            fileLabel += `, ${fileList[i].name}`;
        }
    }

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('fileUpload.upload')}</CustomCardTitle>
            </CustomCardHeader>
            {/* Server-side success message */}
            <Alert variant="success" show={!!successCount && successCount > 0}>
                {t('fileUpload.success', { count: successCount })}
            </Alert>
            {/* Server-side errors */}
            <ErrorAlert
                title={t('fileUpload.failed')}
                messages={errorMessages}
                show={errorMessages.length > 0}
            />
            <Form.File
                id="custom-file-upload"
                data-browse={t('fileUpload.browse')}
                className="mb-3"
                label={fileLabel}
                custom
                name="files"
                multiple={multiple}
                disabled={loading}
                onChange={handleChange}
                accept={accept}
            />

            {!validSize && (
                <FormError
                    message={t('fileUpload.sizeLimitError', { maxSize: fileSizeValidator.maxSizeInMiB }).toString()}
                />
            )}

            {hintMessage && (
                <Form.Text muted>
                    {hintMessage}
                </Form.Text>
            )}

            <Button
                variant="success"
                size="sm"
                disabled={loading || !validSize || fileList.length === 0}
                onClick={handleUpload}
            >
                {
                    loading
                        ? (
                            <>
                                <Spinner animation="border" size="sm" />
                                {' '}
                                {t('fileUpload.uploadInProgress')}
                                .
                            </>
                        )
                        : (
                            <>
                                <FontAwesomeIcon icon={faUpload} />
                                {' '}
                                {t('fileUpload.upload')}
                            </>
                        )
                }
            </Button>
        </CustomCard>
    );
}
