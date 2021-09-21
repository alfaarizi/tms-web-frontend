import React, { ReactNode } from 'react';
import { Translation } from 'react-i18next';
import ErrorPage from 'pages/ErrorPage';

type Props = {
    children: ReactNode
}

type State = {
    hasError: boolean,
    message: string
}

/**
 * Handles uncaught errors
 * Docs: https://reactjs.org/docs/error-boundaries.html
 */
export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, message: '' };
    }

    // Set state
    static getDerivedStateFromError(error: Error) {
        return {
            hasError: true,
            message: error.message,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Logging and error reporting should be placed here
    }

    render() {
        const { hasError, message } = this.state;
        const { children } = this.props;
        // Renders errorPage if hasError is true
        return hasError ? (
            <Translation>
                {
                    (t, { i18n }) => (
                        <ErrorPage
                            title={t('errorPage.genericMessage')}
                            message={message}
                        />
                    )
                }
            </Translation>
        ) : children;
    }
}
