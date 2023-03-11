import { useQuery } from 'react-query';
import * as SystemService from 'api/common/SystemService';
import { PublicSystemInfo } from 'resources/common/PublicSystemInfo';
import { PrivateSystemInfo } from 'resources/common/PrivateSystemInfo';
import { useGlobalContext } from 'context/GlobalContext';

const PUBLIC_INFO_QUERY_KEY = 'common/public system info';
export const PRIVATE_INFO_QUERY_KEY = 'common/private system info';

export function usePublicSystemInfoQuery(enabled: boolean = true) {
    return useQuery<PublicSystemInfo>(
        PUBLIC_INFO_QUERY_KEY,
        SystemService.publicInfo,
        {
            enabled,
            staleTime: Infinity,
        },
    );
}

export function usePrivateSystemInfoQuery(enabled: boolean = true) {
    const globalContext = useGlobalContext();

    return useQuery<PrivateSystemInfo>(
        PRIVATE_INFO_QUERY_KEY,
        SystemService.privateInfo,
        {
            enabled,
            onSuccess: async (data) => {
                if (!data) {
                    return;
                }
                // Set selected semester to actual semester, if it is null
                if (globalContext.selectedSemester === null) {
                    globalContext.setSelectedSemester(data.actualSemester);
                }
            },
            staleTime: Infinity,
        },
    );
}
