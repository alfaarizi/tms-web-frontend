import React, { ReactNode, createContext, useContext } from 'react';
import { Translation } from 'react-i18next';
import ErrorPage from 'pages/ErrorPage';

export interface ErrorBoundaryContextInterface {
    /**
     * Trigger error manually.
     * @param error
     */
    triggerError: (error: Error) => void;
}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextInterface>({
    triggerError: () => {
        throw new Error('Context in not initialized');
    },
});

/**
 * Access error boundary functionality from child components
 */
export function useErrorBoundaryContext() {
    return useContext(ErrorBoundaryContext);
}

type Props = {
    children: ReactNode
}

type State = {
    hasError: boolean,
    message: string
}

/**
 * Global error handler, catches uncaught errors and provides an option to trigger errors manually.
 * Note: Error boundaries cannot catch errors from async code, use triggerError function instead.
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

    triggerError = (error: Error) => {
        this.setState({
            hasError: true,
            message: error.message,
        });
    }

    render() {
        const { hasError, message } = this.state;
        const { children } = this.props;
        const contextValue = {
            triggerError: this.triggerError,
        };

        return (
            <ErrorBoundaryContext.Provider value={contextValue}>
                {
                    // Renders errorPage if hasError is true
                    hasError ? (
                        <Translation>
                            {
                                (t) => (
                                    <ErrorPage
                                        title={t('errorPage.genericMessage')}
                                        message={message}
                                    />
                                )
                            }
                        </Translation>
                    ) : children
                }
            </ErrorBoundaryContext.Provider>
        );
    }
}
