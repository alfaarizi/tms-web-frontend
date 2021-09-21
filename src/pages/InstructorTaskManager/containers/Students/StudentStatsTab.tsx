import React from 'react';
import { useTranslation } from 'react-i18next';

import { Group } from 'resources/instructor/Group';
import { User } from 'resources/common/User';
import { useStudentStats } from 'hooks/instructor/GroupHooks';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { GroupPointsBoxPlot } from 'pages/InstructorTaskManager/components/Groups/GroupPointsBoxPlot';
import { PointsTable } from 'pages/InstructorTaskManager/components/Groups/PointsTable';
import { StudentHandlingTimeTable } from 'pages/InstructorTaskManager/components/Students/StudentHandlingTimeTable';

type Props = {
    group: Group;
    user: User;
}

export function StudentStatsTab({
    group,
    user,
}: Props) {
    const { t } = useTranslation();
    const studentStats = useStudentStats(group.id, user.id);

    if (!studentStats.data) {
        return null;
    }

    const groupData = studentStats.data.map((p) => ({
        taskID: p.taskID,
        name: p.name,
        points: p.group,
        user: p.user,
    }));

    return (
        <>
            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>{t('group.stats.points')}</CustomCardTitle>
                </CustomCardHeader>

                <GroupPointsBoxPlot data={groupData} username={user.name} />
                <PointsTable stats={groupData} showUserColumn />
            </CustomCard>

            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>{t('group.stats.handlingTime')}</CustomCardTitle>
                </CustomCardHeader>

                <StudentHandlingTimeTable data={studentStats.data} />
            </CustomCard>
        </>
    );
}
