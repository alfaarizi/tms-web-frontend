import { useTranslation } from 'react-i18next';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { useStatistics, useDetailedStatistics } from '@/hooks/admin/StatisticsHooks';
import { useSemesters } from '@/hooks/common/SemesterHooks';
import { StatisticsSemester } from '@/resources/admin/StatisticsSemester';
import { StatisticsLinePlot } from '@/pages/AdminStatistics/components/StatisticsLinePlot';
import { DataRow } from '@/components/DataRow';
import { SingleColumnLayout } from '@/layouts/SingleColumnLayout';

export function AdminStatisticsPage() {
    const { t } = useTranslation();
    const semesters = useSemesters();
    const globalStatistics = useStatistics();
    const detailedStatistics = useDetailedStatistics(semesters.data?.map((s) => s.id) || []);

    if (!semesters.data) return null;
    if (!globalStatistics.data) return null;
    if (!detailedStatistics.data) return null;

    const createLineData = (name: string, extractor: (s: StatisticsSemester) => number, color: string) => ({
        name,
        points: semesters.data.map((s, i) => ({
            semester: s.name,
            value: extractor(detailedStatistics.data[i]),
        })),
        color,
    });

    const dataGroups = [createLineData(t('statistics.groupsCount'), (s) => s.groupsCount, 'orange')];
    const dataTasks = [createLineData(t('statistics.tasksCount'), (s) => s.tasksCount, 'red')];
    const dataSubmissions = [
        createLineData(t('statistics.submissionsCount'), (s) => s.submissionsCount, 'blue'),
        createLineData(t('statistics.testedSubmissionsCount'), (s) => s.testedSubmissionCount, 'green'),
    ];

    return (
        <SingleColumnLayout>
            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>
                        {t('statistics.systemStatistics')}
                    </CustomCardTitle>
                </CustomCardHeader>
                <DataRow
                    label={t('statistics.groupsCount')}
                >
                    {globalStatistics.data.groupsCount}
                </DataRow>
                <DataRow
                    label={t('statistics.tasksCount')}
                >
                    {globalStatistics.data.tasksCount}
                </DataRow>
                <DataRow
                    label={t('statistics.submissionsCount')}
                >
                    {globalStatistics.data.submissionsCount}
                </DataRow>
                <DataRow
                    label={t('statistics.submissionsUnderTesting')}
                >
                    {globalStatistics.data.submissionsUnderTestingCount}
                </DataRow>
                <DataRow label={t('statistics.submissionsToBeTested')}>
                    {globalStatistics.data.submissionsToBeTested}
                </DataRow>
                {globalStatistics.data.diskFree && (
                    <DataRow label={t('statistics.freeDiskSpace')}>
                        {Math.round(globalStatistics.data.diskFree / 1_000_000_000)}
                        {' GB'}
                    </DataRow>
                )}
            </CustomCard>
            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>{t('statistics.statisticsOverSemesters')}</CustomCardTitle>
                </CustomCardHeader>
                <StatisticsLinePlot input={dataGroups} />
                <StatisticsLinePlot input={dataTasks} />
                <StatisticsLinePlot input={dataSubmissions} />
            </CustomCard>
        </SingleColumnLayout>
    );
}
