import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as SemestersService from 'api/admin/SemestersSerivce';
import { USER_INFO_QUERY_KEY } from 'hooks/common/UserHooks';

export const SEMESTERS_QUERY_KEY = 'semesters';

export function useNextSemester() {
    return useQuery([SEMESTERS_QUERY_KEY, 'next'], SemestersService.getNext);
}

export function useAddNextSemesterMutation() {
    const queryClient = useQueryClient();

    return useMutation(() => SemestersService.addNext(), {
        onSuccess: async () => {
            // Reload semesters
            await queryClient.invalidateQueries(SEMESTERS_QUERY_KEY);
            // Reload user info (it contains the actual semester for other queries)
            await queryClient.invalidateQueries(USER_INFO_QUERY_KEY);
        },
    });
}
