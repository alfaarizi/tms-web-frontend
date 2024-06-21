import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Alert, Form, Button, Spinner,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FormError } from 'components/FormError';
import { VerifyItem } from 'resources/student/VerifyItem';
import { ValidationErrorBody } from 'exceptions/ServerSideValidationError';
import { useServersideFormErrors } from 'ui-hooks/useServersideFormErrors';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';

type Props = {
    onSave: (data: VerifyItem) => void,
    serverSideError: ValidationErrorBody | null,
    isLoading:boolean
};

/**
 * Displays password field for password protected tasks and tests
 * @param onSave
 * @param serverSideError
 * @constructor
 */
export function VerifyItemForm({ onSave, serverSideError, isLoading }: Props) {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,

        formState: {
            errors,
        },
    } = useForm<VerifyItem>();
    useServersideFormErrors<VerifyItem>(clearErrors, setError, serverSideError);

    const onSubmit = handleSubmit((data) => {
        onSave(data);
    });

    return (
        <Alert variant="warning" className="shadow-sm border-warning">
            <CustomCardHeader>
                <CustomCardTitle>{t('passwordProtected.verifyRequired')}</CustomCardTitle>
            </CustomCardHeader>
            <p className="text-danger">{t('passwordProtected.studentWarning')}</p>
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>
                        {t('login.password')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="password"
                        autoComplete="off"
                        {...register('password', { required: t('common.fieldRequired').toString() })}
                        size="sm"
                    />
                    {errors.password && <FormError message={errors.password.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        id="disableIpCheck"
                        label={t('passwordProtected.verifyDisableIpCheck')}
                        {...register('disableIpCheck')}
                    />
                    {errors.disableIpCheck && <FormError message={errors.disableIpCheck.message} />}
                </Form.Group>

                <Button variant="primary" size="sm" type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faLockOpen} />}
                    {' '}
                    {t('passwordProtected.verify')}
                </Button>
            </Form>
        </Alert>
    );
}
