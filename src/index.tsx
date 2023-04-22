// Import global css files
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import ReactGA from 'react-ga4';

import { App } from 'containers/App';
import './i18n/i18n';
import { GlobalContextProvider } from 'context/GlobalContext';
import { ErrorBoundary } from 'components/ErrorBoundary';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

/**
 * Configure React Query.
 * Defaults: https://react-query.tanstack.com/guides/important-defaults
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            notifyOnChangeProps: 'tracked',
            retry: false,
        },
    },
});

// Google Analytics
if (process.env.REACT_APP_GOOGLE_ANALYTICS_ID && process.env.NODE_ENV === 'production') {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);
}

// Render application
ReactDOM.render(
    <ErrorBoundary>
        <GlobalContextProvider>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                    <App />
                    <ReactQueryDevtools initialIsOpen={false} />
                </BrowserRouter>
            </QueryClientProvider>
        </GlobalContextProvider>
    </ErrorBoundary>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
