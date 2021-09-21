import React from 'react';
import { useTranslation } from 'react-i18next';

import { CustomCard } from 'components/CustomCard/CustomCard';
import { InstructorFile } from 'resources/common/InstructorFile';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { FileListItem } from 'components/FileListItem';

type Props = {
    instructorFiles: InstructorFile[],
    onDownload: (id: number, filename: string) => void,
    onRemove?: (id: number) => void
}

export const InstructorFilesList = ({
    instructorFiles,
    onDownload,
    onRemove,
}: Props) => {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('task.instructorFiles')}</CustomCardTitle>
            </CustomCardHeader>
            {instructorFiles.map((file) => (
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
