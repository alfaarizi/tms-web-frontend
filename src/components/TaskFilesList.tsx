import React from 'react';
import { useTranslation } from 'react-i18next';

import { CustomCard } from 'components/CustomCard/CustomCard';
import { TaskFile } from 'resources/common/TaskFile';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { FileListItem } from 'components/FileListItem';

type Props = {
    taskFiles: TaskFile[],
    onDownload: (id: number, filename: string) => void,
    onRemove?: (id: number) => void,
    title?: string
}

export const TaskFilesList = ({
    taskFiles,
    onDownload,
    onRemove,
    title,
}: Props) => {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{title || t('task.taskFiles')}</CustomCardTitle>
            </CustomCardHeader>
            {taskFiles.map((file) => (
                <FileListItem
                    key={file.id}
                    name={file.name}
                    onDownload={() => onDownload(file.id, file.name)}
                    onRemove={onRemove ? () => onRemove(file.id) : undefined}
                />
            ))}
        </CustomCard>
    );
};
