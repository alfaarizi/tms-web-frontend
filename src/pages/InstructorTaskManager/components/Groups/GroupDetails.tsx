import React from 'react';
import { ButtonGroup } from 'react-bootstrap';
import { faCopy, faEdit, faSync } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import { Group } from 'resources/instructor/Group';
import { DataRow } from 'components/DataRow';

type Props = {
    isActualSemester: boolean,
    canvasSyncInProgress: boolean,
    group: Group,
    onEdit: () => void,
    onDuplicate: () => void,
    onRemove: () => void,
    onCanvasSync: () => void
}

export function GroupDetails({
    group,
    isActualSemester,
    canvasSyncInProgress,
    onDuplicate,
    onEdit,
    onRemove,
    onCanvasSync,
}: Props) {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{group.course.name}</CustomCardTitle>
                <ButtonGroup>
                    {isActualSemester
                        ? <ToolbarButton text={t('common.edit')} icon={faEdit} onClick={onEdit} />
                        : null}
                    {isActualSemester && !group.isCanvasCourse
                        ? <DeleteButton onDelete={onRemove} showText />
                        : null}
                    {!group.isCanvasCourse
                        ? <ToolbarButton text={t('common.duplicate')} icon={faCopy} onClick={onDuplicate} />
                        : null}
                    {group.canvasCanBeSynchronized
                        ? (
                            <ToolbarButton
                                isLoading={canvasSyncInProgress}
                                text={t('group.canvasSync')}
                                icon={faSync}
                                onClick={onCanvasSync}
                            />
                        )
                        : null}
                </ButtonGroup>
            </CustomCardHeader>
            <DataRow label="ID">{group.id}</DataRow>
            <DataRow label={t('course.code')}>{group.course.code}</DataRow>
            <DataRow label={t('group.number')}>{group.number}</DataRow>
            <DataRow label={t('common.timezone')}>{group.timezone}</DataRow>
            <DataRow label={t('group.examGroup')}>
                {group.isExamGroup ? t('common.yes') : t('common.no')}
            </DataRow>
        </CustomCard>
    );
}
