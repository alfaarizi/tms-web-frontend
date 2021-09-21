import React from 'react';
import { Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

type Props = {
    isAccepted: string | null | undefined,
    errorMsg: string | null | undefined,
    onClose?: () => void
}

export function AutoTestResultAlert({
    errorMsg,
    isAccepted,
    onClose,
}: Props) {
    const { t } = useTranslation();

    let variant: string = 'secondary';
    if (isAccepted === 'Passed') {
        variant = 'success';
    } else if (isAccepted === 'Failed') {
        variant = 'danger';
    } else if (isAccepted === 'Updated' || isAccepted === 'Uploaded') {
        variant = 'dark';
    } else {
        return null;
    }

    return (
        <Alert
            variant={variant}
            className="mt-2"
            onClose={onClose ? () => onClose() : undefined}
            dismissible={!!onClose}
        >
            <h6>{t('task.autoTester.results')}</h6>
            <hr />
            {isAccepted === 'Updated' || isAccepted === 'Uploaded' ? t('task.autoTester.notTested') : null}
            {isAccepted !== 'Updated' && isAccepted !== 'Uploaded'
                ? <pre className="bg-light p-2 mt-2">{errorMsg}</pre> : null}
        </Alert>
    );
}
