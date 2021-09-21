import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

type Props = {
    onCancel?: () => void,
    isLoading?: boolean
}

export function FormButtons({
    onCancel,
    isLoading,
}: Props) {
    const { t } = useTranslation();

    return (
        <div className="my-1">
            <Button variant="primary" type="submit" size="sm" disabled={isLoading}>
                {isLoading ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faSave} />}
                {' '}
                {t('common.save')}
            </Button>

            {onCancel ? (
                <Button variant="secondary" className="ml-1" size="sm" onClick={onCancel} disabled={isLoading}>
                    <FontAwesomeIcon icon={faTimes} />
                    {' '}
                    {t('common.cancel')}
                </Button>
            ) : null}
        </div>
    );
}
