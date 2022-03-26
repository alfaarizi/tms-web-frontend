import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

type Props = {
    onCancel?: () => void,
    isLoading?: boolean
    isDisabled?: boolean
}

/**
 * Provides submit and cancel buttons for forms
 * @param onCancel A callback function that called after clicking on the Cancel button
 * @param isLoading Show a spinner instead of the button icon
 * @param isDisabled Optional flag to disable buttons even if not lodaing
 * @constructor
 */
export function FormButtons({
    onCancel,
    isLoading,
    isDisabled,
}: Props) {
    const { t } = useTranslation();

    return (
        <div className="my-1">
            <Button variant="primary" type="submit" size="sm" disabled={isLoading || isDisabled}>
                {isLoading ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faSave} />}
                {' '}
                {t('common.save')}
            </Button>

            {onCancel ? (
                <Button
                    variant="secondary"
                    className="ml-1"
                    size="sm"
                    onClick={onCancel}
                    disabled={isLoading || isDisabled}
                >
                    <FontAwesomeIcon icon={faTimes} />
                    {' '}
                    {t('common.cancel')}
                </Button>
            ) : null}
        </div>
    );
}
