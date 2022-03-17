import { useQuery } from 'react-query';
import * as SystemService from 'api/common/SystemService';
import { PublicSystemInfo } from 'resources/common/PublicSystemInfo';

const PUBLIC_INFO_QUERY_KEY = 'common/public system info';

export function usePublicSystemInfoQuery(enabled: boolean) {
    return useQuery<PublicSystemInfo>(
        PUBLIC_INFO_QUERY_KEY,
        SystemService.publicInfo,
        {
            enabled,
            staleTime: Infinity,
        },
    );
}
