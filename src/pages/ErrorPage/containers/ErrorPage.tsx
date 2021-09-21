import React from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import { SingleColumnLayout } from 'layouts/SingleColumnLayout';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

type Props = {
    title: string;
    message?: string;
}

/**
 * Reusable error page
 * @param title Page title, short description about the error
 * @param message Detailed error message (optional)
 * @constructor
 */
export function ErrorPage({ title, message }: Props) {
    const { t } = useTranslation();
    const history = useHistory();

    // Redirect to root path
    const handleRedirect = () => {
        history.replace('/');
    };

    return (
        <SingleColumnLayout>
            <Jumbotron className="mt-4">
                <h1>{title}</h1>
                {message ? <p>{message}</p> : null}
                <hr />
                <p className="mt-4">
                    <Button variant="primary" onClick={handleRedirect}>{t('errorPage.redirectToHome')}</Button>
                </p>
            </Jumbotron>
        </SingleColumnLayout>
    );
}
