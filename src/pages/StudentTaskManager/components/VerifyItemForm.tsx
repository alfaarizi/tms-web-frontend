import React, { ReactNode } from 'react';
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
    isLoading: boolean,
    cardTitle: string,
    cardLabel: string,
    cardWarning: string,
    submitButtonLabel: string,
    children?: ReactNode
};

/**
 * Displays password field for password protected tasks and tests
 * @param onSave
 * @param serverSideError
 * @param isLoading
 * @param children
 * @param cardTitle
 * @param cardLabel
 * @param cardWarning
 * @param submitButtonLabel
 * @constructor
 */
export function VerifyItemForm({
    onSave, serverSideError, isLoading, children, cardTitle, cardLabel, cardWarning, submitButtonLabel,
}: Props) {
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
                <CustomCardTitle>{cardTitle}</CustomCardTitle>
            </CustomCardHeader>
            <p className="text-danger">{cardWarning}</p>
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>
                        {cardLabel}
                        :
                    </Form.Label>
                    <Form.Control
                        type="password"
                        autoComplete="one-time-code"
                        {...register('password', { required: t('common.fieldRequired').toString() })}
                        size="sm"
                    />
                    {errors.password && <FormError message={errors.password.message} />}
                </Form.Group>

                {children}

                <Button variant="primary" size="sm" type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faLockOpen} />}
                    {' '}
                    {submitButtonLabel}
                </Button>
            </Form>
        </Alert>
    );
}
