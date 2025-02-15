import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';

import { CodeCheckerReport } from '@/resources/common/CodeCheckerReport';
import { DataRow } from '@/components/DataRow';
import { ListCardItem } from '@/components/ListCardItem/ListCardItem';
import { SeverityDisplay } from '@/components/CodeChecker/SeverityDisplay/SeverityDisplay';

type Props = {
    report: CodeCheckerReport
}

export function CodeCheckerReportListItem({ report }: Props) {
    const { t } = useTranslation();

    return (
        <ListCardItem key={report.id}>
            <DataRow label={t('task.evaluator.codeCheckerResult.file')}>
                <a href={report.viewerLink} target="_blank" rel="noreferrer">
                    {report.filePath}
                    {' '}
                    (
                    {report.line}
                    {', '}
                    {report.column}
                    )
                    <FontAwesomeIcon icon={faExternalLink} className="ml-1" />
                </a>
            </DataRow>
            <DataRow label={t('task.evaluator.codeCheckerResult.checkerName')}>
                {report.checkerName}
            </DataRow>
            <DataRow label={t('task.evaluator.codeCheckerResult.severity')}>
                <SeverityDisplay severity={report.severity} translatedSeverity={report.translatedSeverity} />
            </DataRow>
            <DataRow label={t('task.evaluator.codeCheckerResult.category')}>
                {report.category}
            </DataRow>
            <DataRow label={t('task.evaluator.codeCheckerResult.message')}>
                {report.message}
            </DataRow>
        </ListCardItem>
    );
}
