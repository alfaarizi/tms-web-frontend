import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { CodeCompassInstance, Status } from 'resources/instructor/CodeCompassInstance';
import { DataRow } from './DataRow';

type Props = {
    codeCompassInstance: CodeCompassInstance
    onClose?: () => void
}

export function CodeCompassInformationAlert({
    codeCompassInstance,
    onClose,
}: Props) {
    const { t } = useTranslation();

    if (!codeCompassInstance) {
        return null;
    }

    const openCodeCompass = () => {
        if (codeCompassInstance.port) {
            window.open(`http://${window.location.hostname}:${codeCompassInstance.port}/#`, '_blank');
        }
    };

    let variant: string;
    if (codeCompassInstance.status === Status.running && !codeCompassInstance.errorLogs) {
        variant = 'success';
    } else if (codeCompassInstance.status === Status.running && codeCompassInstance.errorLogs) {
        variant = 'warning';
    } else {
        variant = 'info';
    }

    return (
        <Alert
            variant={variant}
            className="mt-2"
            onClose={onClose ?? undefined}
            dismissible={!!onClose}
        >
            <h6>{t('codeCompass.information')}</h6>
            <hr />
            {codeCompassInstance.status === Status.running
            && codeCompassInstance.username
            && codeCompassInstance.password
                ? (
                    <div>
                        <DataRow label={t('login.username')}>
                            {codeCompassInstance.username}
                        </DataRow>
                        <DataRow label={t('login.password')}>
                            {codeCompassInstance.password}
                        </DataRow>
                        <hr />
                    </div>
                ) : null }
            {codeCompassInstance.status === Status.waiting
                ? t('codeCompass.tooManyInstances') : null}
            {codeCompassInstance.status === Status.running && codeCompassInstance.errorLogs
                ? (
                    <div>
                        <p>{t('codeCompass.unsuccessfulParsing')}</p>
                        <pre className="bg-light p-2 mt-2">{codeCompassInstance.errorLogs}</pre>
                    </div>
                ) : null}
            {codeCompassInstance.status === Status.running && !codeCompassInstance.errorLogs
                ? t('codeCompass.successfulParsing') : null}
            {codeCompassInstance.status === Status.starting
                ? t('codeCompass.starting') : null}
            {codeCompassInstance.status === Status.running
                ? (
                    <div>
                        <hr />
                        <Button variant="primary" size="sm" onClick={openCodeCompass}>
                            {t('common.openInNewTab')}
                        </Button>
                    </div>
                ) : null}
        </Alert>
    );
}
