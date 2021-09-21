import React from 'react';
import { useTranslation } from 'react-i18next';

import { useGroupStats } from 'hooks/instructor/GroupHooks';
import { Group } from 'resources/instructor/Group';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { GroupHandlingTimeChart } from 'pages/InstructorTaskManager/components/Groups/GroupHandlingTimeChart';
import { GroupHandlingTimeTable } from 'pages/InstructorTaskManager/components/Groups/GroupHandlingTimeTable';
import { GroupPointsBoxPlot } from 'pages/InstructorTaskManager/components/Groups/GroupPointsBoxPlot';
import { PointsTable } from 'pages/InstructorTaskManager/components/Groups/PointsTable';

type Props = {
    group: Group
}

export function GroupStatsTab({ group }: Props) {
    const { t } = useTranslation();
    const stats = useGroupStats(group.id);

    if (!stats.data) {
        return null;
    }

    const points = stats.data.map((p) => ({
        name: p.name,
        points: p.points,
    }));

    return (
        <>
            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>{t('group.stats.points')}</CustomCardTitle>
                </CustomCardHeader>
                <GroupPointsBoxPlot data={points} />
                <PointsTable stats={stats.data} showUserColumn={false} />
            </CustomCard>

            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>{t('group.stats.handlingTime')}</CustomCardTitle>
                </CustomCardHeader>

                <GroupHandlingTimeChart stats={stats.data} />
                <GroupHandlingTimeTable stats={stats.data} />
            </CustomCard>
        </>
    );
}
