import React, { ReactNode, useContext, useState } from 'react';
import { Semester } from 'resources/common/Semester';

/**
 * Describes the public interface of the global client-side state
 */
export interface GlobalContextInterface {
    selectedSemester: Semester | null,
    setSelectedSemester: (semester: Semester) => void,
    currentNotification: NotificationData | null,
    setCurrentNotification: (notification: NotificationData | null) => void,
    isLoggedIn: boolean | null,
    setIsLoggedIn: (value: boolean | null) => void,
    resetState: () => void,
}

export interface NotificationData {
    variant: 'info' | 'success' | 'error',
    message: string
}

/**
 * Set initial values for the new React context
 */
const GlobalContext = React.createContext<GlobalContextInterface>({
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

    const resetState = () => {
        setSelectedSemester(null);
        setCurrentNotification(null);
    };

    const ctx: GlobalContextInterface = {
        selectedSemester,
        setSelectedSemester,
        currentNotification,
        setCurrentNotification,
        isLoggedIn,
        setIsLoggedIn,
        resetState,
    };

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
