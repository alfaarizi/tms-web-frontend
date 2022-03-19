import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataRow } from 'components/DataRow';
import { ButtonGroup } from 'react-bootstrap';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import { Plagiarism } from 'resources/instructor/Plagiarism';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { DeleteToolbarButton } from 'components/Buttons/DeleteToolbarButton';
import { MultiLineTextBlock } from 'components/MutliLineTextBlock/MultiLineTextBlock';

type Props = {
    report: Plagiarism,
    onEdit: () => void
    onDelete: () => void,
    isActualSemester: boolean
}

export function RequestDetails({
    onDelete,
    onEdit,
    report,
    isActualSemester,
}: Props) {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{report.name}</CustomCardTitle>
                {isActualSemester
                    ? (
                        <ButtonGroup>
                            <ToolbarButton
                                icon={faEdit}
                                text={t('common.edit')}
                                onClick={onEdit}
                            />
                            <DeleteToolbarButton onDelete={onDelete} />
                        </ButtonGroup>
                    )
                    : null}
            </CustomCardHeader>
            <DataRow label={t('plagiarism.ignoreThreshold')}>{report.ignoreThreshold}</DataRow>
            <DataRow label={t('common.description')}>
                <MultiLineTextBlock text={report.description} />
            </DataRow>
        </CustomCard>
    );
}
