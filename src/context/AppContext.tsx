import React, { ReactNode, useContext, useState } from 'react';
import { Semester } from 'resources/common/Semester';

export interface NotificationData {
    variant: 'info' | 'success' | 'error',
    message: string
}

export interface AppContextInterface {
    selectedSemester: Semester | null,
    setSelectedSemester: (semester: Semester) => void,
    currentNotification: NotificationData | null,
    setCurrentNotification: (notification: NotificationData | null) => void,
    resetState: () => void,
}

const AppCtx = React.createContext<AppContextInterface>({
    selectedSemester: null,
    setSelectedSemester: () => {
        throw new Error('Context in not initialized');
    },
    currentNotification: null,
    setCurrentNotification: () => {
        throw new Error('Context in not initialized');
    },
    resetState: () => {
        throw new Error('Context in not initialized');
    },
});

type Props = {
    children: ReactNode
}

export function AppContextProvider({ children }: Props) {
    const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
    const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);

    const resetState = () => {
        setSelectedSemester(null);
        setCurrentNotification(null);
    };

    const ctx: AppContextInterface = {
        selectedSemester,
        setSelectedSemester,
        currentNotification,
        setCurrentNotification,
        resetState,
    };

    return (
        <AppCtx.Provider value={ctx}>
            {children}
        </AppCtx.Provider>
    );
}

export function useAppContext() {
    return useContext(AppCtx);
}
