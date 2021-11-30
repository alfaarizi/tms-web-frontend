import React from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormError } from 'components/FormError';
import { MockLogin } from 'resources/common/MockLogin';
import { LoginProps } from 'pages/Login/components/LoginProps';
import { LoginButton } from 'pages/Login/components/LoginButton';
import { useServersideFormErrors } from 'ui-hooks/useServersideFormErrors';

/**
 * Form component for mock-login
 * @param isLoading
 * @param onLogin
 * @param serverSideError
 * @constructor
 */
export function MockLoginForm({
    isLoading,
    onLogin,
    serverSideError,
}: LoginProps<MockLogin>) {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        clearErrors,
        setError,

        formState: {
            errors,
        },
    } = useForm<MockLogin>({
        defaultValues: {
            isStudent: true,
        },
    });
    useServersideFormErrors<MockLogin>(clearErrors, setError, serverSideError);
    const onSubmit = handleSubmit((data) => onLogin(data));

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group>
                <Form.Label>
                    {t('common.neptun')}
                    :
                </Form.Label>
                <Form.Control
                    type="text"
                    {...register('neptun', {
                        required: true,
                        minLength: 6,
                        maxLength: 6,
                    })}
                />
                {errors.neptun && <FormError message={t('login.neptunRequired')} />}
            </Form.Group>

            <Form.Group>
                <Form.Label>
                    {t('common.name')}
                    :
                </Form.Label>
                <Form.Control
                    type="text"
                    {...register('name', {
                        required: t('login.nameRequired')
                            .toString(),
                    })}
                />
                {errors.name && <FormError message={errors.name.message} />}
            </Form.Group>

            <Form.Group>
                <Form.Label>
                    {t('common.email')}
                    :
                </Form.Label>
                <Form.Control
                    type="email"
                    {...register('email', {
                        required: t('login.emailRequired')
                            .toString(),
                    })}
                />
                {errors.email && <FormError message={errors.email.message} />}
            </Form.Group>

            <Form.Group>
                <Form.Check type="checkbox" label={t('login.student')} {...register('isStudent')} />
                <Form.Check type="checkbox" label={t('login.instructor')} {...register('isTeacher')} />
                <Form.Check type="checkbox" label={t('login.admin')} {...register('isAdmin')} />
            </Form.Group>

            <LoginButton isLoading={isLoading} />
        </Form>
    );
}
