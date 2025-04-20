import { useQuery } from 'react-query';
import * as IpRestrictionService from '@/api/instructor/IpRestrictionService';

export const QUERY_KEY = 'instructor/ip-restriction';

export function useIpRestrictions() {
    return useQuery([QUERY_KEY], () => IpRestrictionService.index());
}
