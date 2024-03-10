import {
    useMutation, useQueryClient,
} from 'react-query';
import * as CanvasService from 'api/student/CanvasService';
import { QUERY_KEY as TASK_QUERY_KEY } from 'hooks/student/TaskHooks';

/**
 * Synchronizes the given task submission
 * @param taskID
 */
export function useCanvasSyncSubmissionMutation(taskID: number) {
    const queryClient = useQueryClient();

    return useMutation(
        () => CanvasService.syncSubmission(taskID),
        {
            // the queries should be invalidated both in case of success and error
            onSettled: async () => {
                await queryClient.invalidateQueries([TASK_QUERY_KEY, { taskID }]);
            },
        },
    );
}
