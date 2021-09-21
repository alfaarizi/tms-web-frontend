import { useQuery } from 'react-query';
import * as SemestersService from 'api/common/SemestersService';
import { Semester } from 'resources/common/Semester';
import { useUserInfo } from 'hooks/common/UserHooks';
import { useAppContext } from 'context/AppContext';

export const QUERY_KEY = 'semesters';

/**
 * Load semester list from the server
 * @param enabled Enable or disable the query
 */
export function useSemesters(enabled: boolean = true) {
    return useQuery<Semester[]>(QUERY_KEY, SemestersService.index, {
        enabled,
    });
}

/**
 * Get and set the selected semester
 */
export function useSelectedSemester() {
    const appContext = useAppContext();

    return {
        selectedSemester: appContext.selectedSemester,
        selectedSemesterID: appContext.selectedSemester?.id || -1,
        setSelectedSemester: appContext.setSelectedSemester,
    };
}

/**
 * Get actual semester or check if the given semester is the actual semester
 */
export function useActualSemester() {
    const {
        data,
        isLoading,
    } = useUserInfo(true);

    const check = (semesterID: number | undefined | null) => {
        if (semesterID === null || semesterID === undefined) {
            return false;
        }

        return semesterID === data?.actualSemester.id;
    };

    return {
        check,
        actualSemesterID: data?.actualSemester.id,
        isLoading,
    };
}
