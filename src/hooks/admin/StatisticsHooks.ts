import { useQuery } from 'react-query';
import * as StatisticsService from '@/api/admin/StatisticsService';

export const QUERY_KEY = 'admin/statistics';

export function useStatistics() {
    return useQuery([QUERY_KEY], () => StatisticsService.get());
}

export function useDetailedStatistics(semesterIDs: number[]) {
    return useQuery([QUERY_KEY, { ...semesterIDs }], () => StatisticsService.getDetailed(semesterIDs));
}
