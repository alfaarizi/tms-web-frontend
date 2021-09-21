import React, { useState } from 'react';
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

type Props = {
    multiple: boolean,
    loading: boolean,
    onUpload: (files: File[]) => void,
    accept?: string,
    errorMessages?: string[],
    successCount?: number
}

export function FileUpload({
    loading,
    multiple,
    onUpload,
    accept,
    errorMessages,
    successCount,
}: Props) {
    const { t } = useTranslation();
    const [fileList, setFileList] = useState<File[]>([]);

    const handleUpload = (evt: any) => {
        evt.preventDefault();

        onUpload(fileList);
        setFileList([]);
    };

    const handleChange = (evt: any) => {
        const { files } = evt.target;
        const newFileList = [];
        for (let i = 0; i < files.length; ++i) {
            newFileList.push(files[i]);
        }
        setFileList(newFileList);
        // eslint-disable-next-line no-param-reassign
        evt.target.value = '';
        // eslint-disable-next-line no-param-reassign
        evt.target.files = null;
    };

    let fileLabel = '';
    if (fileList.length > 0) {
        fileLabel = fileList[0].name;
        for (let i = 1; i < fileList.length; ++i) {
            fileLabel += `, ${fileList[i].name}`;
        }
    }

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('common.upload')}</CustomCardTitle>
            </CustomCardHeader>
            <Alert variant="success" show={!!successCount && successCount > 0}>
                {t('common.fileUploadSuccess', { count: successCount })}
            </Alert>
            <ErrorAlert
                title={t('common.fileUploadFailed')}
                messages={errorMessages || []}
                show={!!errorMessages && errorMessages.length > 0}
            />
            <Form.File
                id="custom-file-upload"
                data-browse={t('common.browse')}
                className="mb-3"
                label={fileLabel}
                custom
                name="files"
                multiple={multiple}
                disabled={loading}
                onChange={handleChange}
                accept={accept}
            />
            <Button variant="success" size="sm" disabled={loading || fileList.length < 1} onClick={handleUpload}>
                {
                    loading
                        ? (
                            <>
                                <Spinner animation="border" size="sm" />
                                {' '}
                                {t('common.uploadInProgress')}
                                .
                            </>
                        )
                        : (
                            <>
                                <FontAwesomeIcon icon={faUpload} />
                                {' '}
                                {t('common.upload')}
                            </>
                        )
                }
            </Button>
        </CustomCard>
    );
}
