import React, {
    ChangeEventHandler, MouseEventHandler, ReactNode, useState,
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
import { useFileSizeValidator } from 'hooks/common/useFileSizeValidator';
import { FormError } from 'components/FormError';

type Props = {
    children?: ReactNode,
    multiple: boolean,
    loading: boolean,
    disabled?: boolean,
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
    children,
    loading,
    disabled,
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
            {children}
            <Form.File
                id="custom-file-upload"
                data-browse={t('fileUpload.browse')}
                className="mb-1"
                label={fileLabel}
                custom
                name="files"
                multiple={multiple}
                disabled={disabled || loading || !fileSizeValidator.ready}
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
                className="mt-2"
                disabled={disabled || loading || !validSize || fileList.length === 0 || !fileSizeValidator.ready}
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
