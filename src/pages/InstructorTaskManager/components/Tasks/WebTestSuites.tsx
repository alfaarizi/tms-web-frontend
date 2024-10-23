import React from 'react';
import { FileUpload } from 'components/FileUpload';
import { TaskFilesList } from 'components/TaskFilesList';
import { useTranslation } from 'react-i18next';
import { TaskFile } from 'resources/common/TaskFile';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';

type Props = {
    webTestSuites: TaskFile[]|undefined,
    isLoading: boolean,
    testFileValidationError: string[]|undefined,
    onUpload: (files: File[]) => Promise<void>,
    onDownload: (id: number, fileName: string) => void,
    onDelete: (id: number) => void
}

export const WebTestSuites = ({
    webTestSuites,
    isLoading,
    testFileValidationError,
    onUpload,
    onDownload,
    onDelete,
}: Props) => {
    const { t } = useTranslation();

    return (
        <>
            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>{t('task.evaluator.webTestInfo')}</CustomCardTitle>
                </CustomCardHeader>
                <p>{t('task.evaluator.webTestTemplateDesc')}</p>
                <Button
                    href={`${process.env.PUBLIC_URL}/template.robot`}
                    size="sm"
                    className="mt-2"
                >
                    <FontAwesomeIcon icon={faDownload} />
                    {' '}
                    {t('common.download')}
                </Button>
            </CustomCard>
            <FileUpload
                multiple={false}
                loading={isLoading}
                onUpload={onUpload}
                errorMessages={testFileValidationError}
                hintMessage={t('task.evaluator.webTestSuiteHelp')}
                title={t('task.evaluator.webTestSuiteTitle')}
            />
            {webTestSuites
                && (
                    <TaskFilesList
                        taskFiles={webTestSuites}
                        onDownload={onDownload}
                        onRemove={onDelete}
                        title={t('task.evaluator.webTestSuites')}
                    />
                )}
        </>
    );
};
