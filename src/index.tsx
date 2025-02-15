// Import global css files
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/index.css';

// TODO React Bootstrap 5: This will be fixed when we can upgrade @types/react-dom to v18
// Currently it cannot be updated because it would break React Bootstrap
// @ts-ignore
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import ReactGA from 'react-ga4';

import { App } from '@/containers/App';
import '@/i18n/i18n';
import { GlobalContextProvider } from '@/context/GlobalContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import reportWebVitals from '@/reportWebVitals';

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
if (import.meta.env.VITE_GOOGLE_ANALYTICS_ID && import.meta.env.NODE_ENV === 'production') {
    ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_ID);
}

// Render application
createRoot(document.getElementById('root')!).render(
    <ErrorBoundary>
        <GlobalContextProvider>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter basename={import.meta.env.BASE_URL}>
                    <App />
                    <ReactQueryDevtools initialIsOpen={false} />
                </BrowserRouter>
            </QueryClientProvider>
        </GlobalContextProvider>
    </ErrorBoundary>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
