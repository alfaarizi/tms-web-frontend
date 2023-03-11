import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as SemestersService from 'api/admin/SemestersSerivce';
import { USER_SETTINGS_QUERY_KEY } from 'hooks/common/UserHooks';
import { QUERY_KEY as SEMESTERS_QUERY_KEY } from 'hooks/common/SemesterHooks';

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
            await queryClient.invalidateQueries(USER_SETTINGS_QUERY_KEY);
        },
    });
}
