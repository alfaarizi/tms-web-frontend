import React from 'react';
import { useTranslation } from 'react-i18next';

import { Group } from 'resources/student/Group';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { DataRow } from 'components/DataRow';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { MultiLineTextBlock } from 'components/MutliLineTextBlock/MultiLineTextBlock';
import { GroupDateTime } from 'pages/InstructorTaskManager/components/Groups/GroupDateTime';

type Props = {
    group: Group
}

export function GroupDetails({ group }: Props) {
    const { t } = useTranslation();

    // Prepare instructors list (lecturers if there are no instructors)
    let teachers = group.instructorNames.join(', ');
    if (group.instructorNames.length === 0) {
        teachers = group.course.lecturerNames.join(', ');
    }

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{group.course.name}</CustomCardTitle>
            </CustomCardHeader>
            <DataRow label={t('course.codes')}>{group.course.codes.join(', ')}</DataRow>
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
            {!group.isExamGroup ? (
                <DataRow label={t('group.instructors')}>{teachers}</DataRow>
            ) : null}
            <DataRow label={t('group.notes')}><MultiLineTextBlock text={group.notes} /></DataRow>
        </CustomCard>
    );
}
