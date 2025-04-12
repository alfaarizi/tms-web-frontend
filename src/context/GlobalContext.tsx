import {
    createContext, ReactNode, useContext, useMemo, useState,
} from 'react';
import { Semester } from '@/resources/common/Semester';

/**
 * Describes the public interface of the global client-side state
 */
export interface GlobalContextInterface {
    selectedSemester: Semester | null,
    setSelectedSemester: (semester: Semester) => void,
    currentNotification: NotificationData | null,
    setCurrentNotification: (notification: NotificationData | null) => void,
    /**
     * Indicates whether the user is logged in
     * true: logged in
     * false: logged out
     * null: the status is unknown after application startup
     */
    isLoggedIn: boolean | null,
    setIsLoggedIn: (value: boolean | null) => void,
    theme: AvailableTheme,
    setTheme: (newTheme: AvailableTheme) => void,
    resetState: () => void,
}

export interface NotificationData {
    variant: 'info' | 'success' | 'error',
    message: string
}

export type AvailableTheme = 'dark'|'blue';
const availableThemes = ['dark', 'blue'];
const defaultTheme: AvailableTheme = 'dark';
const configuredTheme = availableThemes.includes(import.meta.env.VITE_THEME)
    ? import.meta.env.VITE_THEME as AvailableTheme
    : defaultTheme;

/**
 * Set initial values for the new React context
 */
const GlobalContext = createContext<GlobalContextInterface>({
    selectedSemester: null,
    setSelectedSemester: () => {
        throw new Error('Context in not initialized');
    },
    currentNotification: null,
    setCurrentNotification: () => {
        throw new Error('Context in not initialized');
    },
    isLoggedIn: null,
    setIsLoggedIn: () => {
        throw new Error('Context in not initialized');
    },
    theme: configuredTheme,
    setTheme: () => {
        throw new Error('Context in not initialized');
    },
    resetState: () => {
        throw new Error('Context in not initialized');
    },
});

type Props = {
    children: ReactNode
}

/**
 * Provider for the global state context
 * @param children
 * @constructor
 */
export function GlobalContextProvider({ children }: Props) {
    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
    const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [theme, setTheme] = useState<AvailableTheme>(configuredTheme);

    const resetState = () => {
        setSelectedSemester(null);
        setCurrentNotification(null);
        setTheme(configuredTheme);
    };

    const ctx: GlobalContextInterface = useMemo(() => ({
        selectedSemester,
        setSelectedSemester,
        currentNotification,
        setCurrentNotification,
        isLoggedIn,
        setIsLoggedIn,
        theme,
        setTheme,
        resetState,
    }), [selectedSemester, currentNotification, isLoggedIn, theme]);

    return (
        <GlobalContext.Provider value={ctx}>
            {children}
        </GlobalContext.Provider>
    );
}

/**
 * Access global state directly
 */
export function useGlobalContext() {
    return useContext(GlobalContext);
}
