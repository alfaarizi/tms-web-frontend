import React from 'react';
import { Alert } from 'react-bootstrap';

import { CodeCheckerResult } from 'resources/instructor/CodeCheckerResult';
import { CodeCheckerReportsList } from 'components/CodeChecker/CodeCheckerReportsList';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { useTranslation } from 'react-i18next';

type Props = {
    result: CodeCheckerResult
}

export function StaticCodeAnalysisTab({ result }: Props) {
    const { t } = useTranslation();

    if (result.status === 'Runner Error') {
        return (
            <Alert variant="danger" className="mt-2">
                <h5>{t('task.evaluator.codeCheckerResult.detailedStatusMessages.runnerError')}</h5>
                <hr />
                <pre className="bg-light p-2 mt-2">{result.runnerErrorMessage}</pre>
            </Alert>
        );
    }

    return (
        <>
            <CodeCheckerReportsList status={result.status} reports={result.codeCheckerReports} />
            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>
                        {t('task.evaluator.stdout')}
                    </CustomCardTitle>
                </CustomCardHeader>
                <pre className="bg-light">{result.stdout}</pre>
            </CustomCard>
            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>
                        {t('task.evaluator.stderr')}
                    </CustomCardTitle>
                </CustomCardHeader>
                <pre className="bg-light">{result.stderr}</pre>
            </CustomCard>
        </>
    );
}
