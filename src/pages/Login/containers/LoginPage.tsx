import React, { useState } from 'react';
import { MockLogin } from 'resources/common/MockLogin';
import { useClientSideLocaleChange, useLdapLoginMutation, useMockLoginMutation } from 'hooks/common/UserHooks';
import { MockLoginForm } from 'pages/Login/components/MockLoginForm';
import { SingleColumnLayout } from 'layouts/SingleColumnLayout';
import { LoginCard } from 'pages/Login/components/LoginCard';
import { LdapLoginForm } from 'pages/Login/components/LdapLoginForm';
import { LdapLogin } from 'resources/common/LdapLogin';
import { ServerSideValidationError, ValidationErrorBody } from 'exceptions/ServerSideValidationError';

/**
 * Displays a login form based on the value of REACT_APP_LOGIN_METHOD env variable
 * @constructor
 */
export function LoginPage() {
    // Login mutations
    const mockLoginMutation = useMockLoginMutation();
    const ldapLoginMutation = useLdapLoginMutation();
    // Language change mutation
    const clientSideLocaleChange = useClientSideLocaleChange();
    // Store serverside validation errors
    const [validationError, setValidationError] = useState<ValidationErrorBody | null>(null);

    const handleMockLogin = async (data: MockLogin) => {
        try {
            await mockLoginMutation.mutateAsync(data);
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setValidationError(e.body);
            }
        }
    };

    const handleLdapLogin = async (data: LdapLogin) => {
        try {
            await ldapLoginMutation.mutateAsync(data);
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setValidationError(e.body);
            }
        }
    };

    const handleLocaleChange = async (locale: string) => {
        await clientSideLocaleChange.change(locale);
    };

    // Select the correct login form
    let formToDisplay;
    switch (process.env.REACT_APP_LOGIN_METHOD) {
    case 'MOCK':
        formToDisplay = (
            <MockLoginForm
                onLogin={handleMockLogin}
                isLoading={mockLoginMutation.isLoading}
                serverSideError={validationError}
            />
        );
        break;
    case 'LDAP':
        formToDisplay = (
            <LdapLoginForm
                onLogin={handleLdapLogin}
                isLoading={mockLoginMutation.isLoading}
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
            <LoginCard onLocaleChange={handleLocaleChange}>
                {formToDisplay}
            </LoginCard>
        </SingleColumnLayout>
    );
}
