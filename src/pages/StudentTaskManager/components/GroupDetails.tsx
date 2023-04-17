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

    // Prepare instructors list
    let instructors = '';
    if (group.instructorNames.length > 0) {
        [instructors] = group.instructorNames;
        for (let i = 1; i < group.instructorNames.length; ++i) {
            instructors += `, ${group.instructorNames[i]}`;
        }
    }

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{group.course.name}</CustomCardTitle>
            </CustomCardHeader>
            <DataRow label={t('course.code')}>{group.course.code}</DataRow>
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
            <DataRow label={t('group.instructors')}>{instructors}</DataRow>
            <DataRow label={t('group.notes')}><MultiLineTextBlock text={group.notes} /></DataRow>
        </CustomCard>
    );
}
