import React from 'react';
import { Alert, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { AutoTesterResult } from 'resources/common/AutoTesterResult';

type Props = {
    isAccepted: string | null | undefined,
    errorMsg: string | null | undefined,
    results: AutoTesterResult[] | undefined,
    onClose?: () => void
}

export function AutoTestResultAlert({
    isAccepted,
    errorMsg,
    results,
    onClose,
}: Props) {
    const { t } = useTranslation();

    let variant: string;
    if (isAccepted === 'Passed') {
        variant = 'success';
    } else if (isAccepted === 'Failed') {
        variant = 'danger';
    } else if (isAccepted === 'Uploaded') {
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
            {isAccepted === 'Uploaded' ? t('task.evaluator.notTested') : null}

            {isAccepted !== 'Uploaded' && (!results || results.length === 0)
                ? <pre className="bg-light p-2 mt-2">{errorMsg}</pre> : null}

            {isAccepted !== 'Uploaded' && !!results && results.length > 0
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
        </Alert>
    );
}
