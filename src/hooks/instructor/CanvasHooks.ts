import {
    QueryClient,
    useMutation, useQuery, useQueryClient,
} from 'react-query';
import * as CanvasService from '@/api/instructor/CanvasService';

import { QUERY_KEY as GROUP_QUERY_KEY } from '@/hooks/instructor/GroupHooks';
import { QUERY_KEY as TASK_QUERY_KEY } from '@/hooks/instructor/TaskHooks';
import { CanvasOauth2Response } from '@/resources/instructor/CanvasOauth2Response';
import { CanvasSetupData } from '@/resources/instructor/CanvasSetupData';

export const QUERY_KEY = 'instructor/canvas';

async function afterSync(queryClient: QueryClient, groupID: number, semesterID?: number) {
    // Reload group list for the given semester if needed
    if (semesterID) {
        await queryClient.invalidateQueries([GROUP_QUERY_KEY, { semesterID }]);
    }

    // Invalidate all queries that can be affected by synchronization
    await queryClient.invalidateQueries([TASK_QUERY_KEY, { groupID }]);
    await queryClient.invalidateQueries([GROUP_QUERY_KEY, { groupID }]);
    await queryClient.invalidateQueries([GROUP_QUERY_KEY, 'students', { groupID }]);
    await queryClient.invalidateQueries([GROUP_QUERY_KEY, 'instructors', { groupID }]);
    await queryClient.invalidateQueries([GROUP_QUERY_KEY, 'stats']);
}

/**
 * Synchronizes the given group
 * @param groupID
 * @param semesterID
 */
export function useCanvasSetupMutation(groupID: number, semesterID?: number) {
    const queryClient = useQueryClient();

    return useMutation(
        (data: CanvasSetupData) => CanvasService.setup(groupID, data),
        {
            // the queries should be invalidated both in case of success and error
            onSettled: async () => {
                await afterSync(queryClient, groupID, semesterID);
            },
        },
    );
}

/**
 * Synchronizes the given group
 * @param groupID
 */
export function useCanvasSyncMutation(groupID: number) {
    const queryClient = useQueryClient();

    return useMutation(
        () => CanvasService.sync(groupID),
        {
            // the queries should be invalidated both in case of success and error
            onSettled: async () => {
                await afterSync(queryClient, groupID);
            },
        },
    );
}

/**
 * Cancel synchronization of the given group
 * @param groupID
 * @param semesterID
 */
export function useCancelCanvasSyncMutation(groupID: number, semesterID?: number) {
    const queryClient = useQueryClient();

    return useMutation(
        () => CanvasService.cancelSync(groupID),
        {
            // the queries should be invalidated both in case of success and error
            onSettled: async () => {
                await afterSync(queryClient, groupID, semesterID);
            },
        },
    );
}

/**
 * Forwards OAuth2 response to backend
 */
export function useCanvasOauth2ResponseMutation() {
    return useMutation((data: CanvasOauth2Response) => CanvasService.oauth2Response(data));
}

/**
 * Loads Canvas courses
 * @param enabled Enable query
 * @param refetchOnWindowFocus
 */
export function useCanvasCourses(enabled: boolean, refetchOnWindowFocus: boolean) {
    return useQuery(
        [QUERY_KEY, 'courses'],
        CanvasService.getCanvasCourses,
        { enabled, refetchOnWindowFocus },
    );
}

/**
 * Loads Canvas sections for the given Canvas course
 * @param courseID Canvas course id
 * @param enabled Enable query
 * @param refetchOnWindowFocus
 */
export function useCanvasSections(courseID: number, enabled: boolean, refetchOnWindowFocus: boolean) {
    return useQuery(
        [QUERY_KEY, 'sections', { courseID }],
        () => CanvasService.getCanvasSections(courseID),
        { enabled, refetchOnWindowFocus },
    );
}
