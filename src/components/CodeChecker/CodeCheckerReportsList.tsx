import React, { useMemo } from 'react';

import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { useTranslation } from 'react-i18next';
import { CodeCheckerReportListItem } from 'components/CodeChecker/CodeCheckerReportListItem';
import { CodeCheckerReport, SeverityOrder } from 'resources/common/CodeCheckerReport';
import { CodeCheckerResultStatus } from 'resources/common/CodeCheckerResultStatus';

type Props = {
    status: CodeCheckerResultStatus,
    reports: CodeCheckerReport[],
}

export function CodeCheckerReportsList({ status, reports }: Props) {
    const { t } = useTranslation();

    const content = useMemo(() => {
        switch (status) {
        case 'In Progress':
            return <span>{t('task.evaluator.codeCheckerResult.detailedStatusMessages.inProgress')}</span>;
        case 'No Issues':
            return <span>{t('task.evaluator.codeCheckerResult.detailedStatusMessages.noIssues')}</span>;
        case 'Issues Found':
            return reports
                .sort((a, b) => SeverityOrder[b.severity] - SeverityOrder[a.severity])
                .map((report) => <CodeCheckerReportListItem key={report.id} report={report} />);
        case 'Analysis Failed':
            return <span>{t('task.evaluator.codeCheckerResult.detailedStatusMessages.analysisFailed')}</span>;
        case 'Runner Error':
            return <span>{t('task.evaluator.codeCheckerResult.detailedStatusMessages.runnerError')}</span>;
        default:
            throw new Error('Unknown CodeChecker result status');
        }
    }, [status, reports]);

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('task.evaluator.staticCodeAnalysisReports')}</CustomCardTitle>
            </CustomCardHeader>
            {content}
        </CustomCard>
    );
}
