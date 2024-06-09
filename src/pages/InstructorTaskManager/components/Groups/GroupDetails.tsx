import React from 'react';
import { ButtonGroup } from 'react-bootstrap';
import { faCopy, faEdit, faSync } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { DeleteToolbarButton } from 'components/Buttons/DeleteToolbarButton';
import { Group } from 'resources/instructor/Group';
import { DataRow } from 'components/DataRow';
import { GroupDateTime } from 'pages/InstructorTaskManager/components/Groups/GroupDateTime';

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
                        ? <DeleteToolbarButton onDelete={onRemove} />
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
            <DataRow label={t('course.codes')}>{group.course.codes}</DataRow>
            <DataRow label={t('group.number')}>{group.number}</DataRow>
            {group.canvasUrl ? (
                <DataRow label={t('group.canvasCourse')}>
                    <a href={group.canvasUrl} target="_blank" rel="noreferrer">{group.canvasUrl}</a>
                </DataRow>
            ) : null}
            {group.canvasUrl ? (
                <DataRow label={t('group.lastSyncTime')}>
                    <GroupDateTime value={group.lastSyncTime} timezone={group.timezone} />
                </DataRow>
            ) : null}
            <DataRow label={t('common.timezone')}>{group.timezone}</DataRow>
            <DataRow label={t('group.examGroup')}>
                {group.isExamGroup ? t('common.yes') : t('common.no')}
            </DataRow>
        </CustomCard>
    );
}
