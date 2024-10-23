import React from 'react';
import { Alert, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faDownload } from '@fortawesome/free-solid-svg-icons';
import { AutoTesterResult } from 'resources/common/AutoTesterResult';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';

type Props = {
    status: string | null | undefined,
    errorMsg: string | null | undefined,
    onClose?: () => void,
    appType: string,
    onReportDownload: () => void
    results: AutoTesterResult[] | undefined,
}

export function AutoTestResultAlert({
    status,
    errorMsg,
    results,
    onClose,
    appType,
    onReportDownload,
}: Props) {
    const { t } = useTranslation();

    let variant: string;
    if (status === 'Passed') {
        variant = 'success';
    } else if (status === 'Failed') {
        variant = 'danger';
    } else if (status === 'Uploaded') {
        variant = 'primary';
    } else {
        variant = 'secondary';
    }

    return (
        <Alert
            variant={variant}
            className="mt-2"
            onClose={onClose ? () => onClose() : undefined}
            dismissible={!!onClose}
        >
            <h6>{t('task.evaluator.results')}</h6>
            <hr />
            {status === 'Uploaded' ? t('task.evaluator.notTested') : null}

            {status !== 'Uploaded' && (!results || results.length === 0)
                ? <pre className="bg-light p-2 mt-2">{errorMsg}</pre> : null}

            {status !== 'Uploaded' && !!results && results.length > 0
                ? (
                    <Table className="bg-light">
                        {results.map((result) => (
                            <tr>
                                <td>
                                    {result.isPassed
                                        ? <FontAwesomeIcon icon={faCircleCheck} className="fa-fw text-success" />
                                        : <FontAwesomeIcon icon={faCircleXmark} className="fa-fw text-danger" />}
                                    &nbsp;
                                    #
                                    {result.testCaseNr}
                                </td>
                                <td>
                                    {!result.isPassed
                                        ? <pre>{result.errorMsg}</pre>
                                        : null}
                                </td>
                            </tr>
                        ))}
                    </Table>
                )
                : null}

            {status !== 'Uploaded' && appType === 'Web'
                && (
                    <ToolbarButton
                        icon={faDownload}
                        text={t('task.evaluator.downloadReport')}
                        onClick={onReportDownload}
                    />
                )}
        </Alert>
    );
}
