import React from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LdapLogin } from 'resources/common/LdapLogin';
import { LoginProps } from 'pages/Login/components/LoginProps';
import { LoginButton } from 'pages/Login/components/LoginButton';
import { FormError } from 'components/FormError';
import { useServersideFormErrors } from 'ui-hooks/useServersideFormErrors';

/**
 * Form component for LDAP login
 * @param isLoading
 * @param onLogin
 * @param serverSideError
 * @constructor
 */
export function LdapLoginForm({
    isLoading,
    onLogin,
    serverSideError,
}: LoginProps<LdapLogin>) {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        clearErrors,
        setError,

        formState: {
            errors,
        },
    } = useForm<LdapLogin>();
    useServersideFormErrors<LdapLogin>(clearErrors, setError, serverSideError);

    const onSubmit = handleSubmit((data) => onLogin(data));

    return (
        <Form onSubmit={onSubmit}>
            <p>{t('login.ldapHelp')}</p>
            <Form.Group>
                <Form.Label>
                    {t('login.username')}
                    :
                </Form.Label>
                <Form.Control
                    type="text"
                    {...register('username', {
                        required: t('common.fieldRequired')
                            .toString(),
                    })}
                />
                {errors.username && <FormError message={errors.username.message} />}
            </Form.Group>

            <Form.Group>
                <Form.Label>
                    {t('login.password')}
                    :
                </Form.Label>
                <Form.Control
                    type="password"
                    {...register('password', {
                        required: t('common.fieldRequired')
                            .toString(),
                    })}
                />
                {errors.password && <FormError message={errors.password.message} />}
            </Form.Group>

            <LoginButton isLoading={isLoading} />
        </Form>
    );
}
