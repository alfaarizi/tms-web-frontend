import React, { useState } from 'react';
import { MockLogin } from 'resources/common/MockLogin';
import { useLdapLoginMutation, useMockLoginMutation } from 'hooks/common/UserHooks';
import { MockLoginForm } from 'pages/Login/components/MockLoginForm';
import { SingleColumnLayout } from 'layouts/SingleColumnLayout';
import { LoginCard } from 'pages/Login/components/LoginCard';
import { LdapLoginForm } from 'pages/Login/components/LdapLoginForm';
import { LdapLogin } from 'resources/common/LdapLogin';
import { ServerSideValidationError, ValidationErrorBody } from 'exceptions/ServerSideValidationError';
import { DefaultUserLogin } from 'pages/Login/components/DefaultUserLogin';
import { LoginResponse } from 'resources/common/LoginResponse';
import { env } from 'runtime-env';

type AsyncLoginFn<TData> = (data: TData) => Promise<LoginResponse>;

/**
 * Displays a login form based on the value of REACT_APP_LOGIN_METHOD env variable
 * @constructor
 */
export function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    // Login mutations
    const mockLoginMutation = useMockLoginMutation();
    const ldapLoginMutation = useLdapLoginMutation();
    // Store serverside validation errors
    const [validationError, setValidationError] = useState<ValidationErrorBody | null>(null);

    /**
     * Returns a new login handler for the given login mutation function
     * @param loginFn login mutation function
     */
    const getLoginHandler = <TData, >(loginFn: AsyncLoginFn<TData>) => (async (data: TData) => {
        try {
            setIsLoading(true);
            await loginFn(data);
            setIsLoading(false);
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setValidationError(e.body);
            }

            const ms = parseInt(process.env.REACT_APP_TIMEOUT_AFTER_FAILED_LOGIN, 10);
            setTimeout(() => setIsLoading(false), ms);
        }
    });

    const handleMockLogin = getLoginHandler<MockLogin>(mockLoginMutation.mutateAsync);
    const handleLdapLogin = getLoginHandler<LdapLogin>(ldapLoginMutation.mutateAsync);

    // Select the correct login form
    let formToDisplay;
    switch (env.REACT_APP_LOGIN_METHOD) {
    case 'MOCK':
        formToDisplay = (
            <>
                <MockLoginForm
                    onLogin={handleMockLogin}
                    isLoading={isLoading}
                    serverSideError={validationError}
                />
                <DefaultUserLogin
                    onLogin={handleMockLogin}
                    isLoading={isLoading}
                />
            </>
        );
        break;
    case 'LDAP':
        formToDisplay = (
            <LdapLoginForm
                onLogin={handleLdapLogin}
                isLoading={isLoading}
                serverSideError={validationError}
            />
        );
        break;
    default:
        formToDisplay = <p>REACT_APP_LOGIN_METHOD is invalid</p>;
        break;
    }

    // Render page
    return (
        <SingleColumnLayout>
            <LoginCard>
                {formToDisplay}
            </LoginCard>
        </SingleColumnLayout>
    );
}
