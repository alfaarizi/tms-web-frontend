import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as EvaluatorService from 'api/instructor/EvaluatorService';
import { EvaluatorAdditionalInformation } from 'resources/instructor/EvaluatorAdditionalInformation';
import { SetupEvaluatorEnvironment } from 'resources/instructor/SetupEvaluatorEnvironment';
import { SetupAutoTester } from 'resources/instructor/SetupAutoTester';
import { QUERY_KEY as TASKS_QUERY_KEY } from 'hooks/instructor/TaskHooks';
import { SetupCodeChecker } from 'resources/instructor/SetupCodeChecker';

const QUERY_KEY = 'instructor/task-evaluator';

export function useEvaluatorAdditionalInformation(taskID: number, enabled: boolean) {
    return useQuery<EvaluatorAdditionalInformation>(
        [QUERY_KEY, { taskID }, 'additional-information'],
        () => EvaluatorService.evaluatorAdditionalInformation(taskID), {
            enabled,
        },
    );
}

export function useSetupEvaluatorEnvironment(taskID: number) {
    const queryClient = useQueryClient();

    return useMutation((data: SetupEvaluatorEnvironment) => EvaluatorService.setupEvaluatorEnvironment(taskID, data), {
        onSuccess: async (data) => {
            queryClient.setQueryData([TASKS_QUERY_KEY, { taskID: data.id }], data);
            await queryClient.invalidateQueries([QUERY_KEY, { taskID }, 'additional-information']);
        },
    });
}

export function useSetupAutoTester(taskID: number) {
    const queryClient = useQueryClient();

    return useMutation((data: SetupAutoTester) => EvaluatorService.setupAutoTester(taskID, data), {
        onSuccess: async (data) => {
            queryClient.setQueryData([TASKS_QUERY_KEY, { taskID }], data);
        },
    });
}

export function useSetupCodeChecker(taskID: number) {
    const queryClient = useQueryClient();

    return useMutation((data: SetupCodeChecker) => EvaluatorService.setupCodeChecker(taskID, data), {
        onSuccess: async (data) => {
            queryClient.setQueryData([TASKS_QUERY_KEY, { taskID }], data);
        },
    });
}

export function useUpdateDockerImageMutation(taskID: number) {
    const queryClient = useQueryClient();

    return useMutation(() => EvaluatorService.updateDockerImage(taskID), {
        onSuccess: async (data) => {
            queryClient.setQueryData([QUERY_KEY, { taskID }, 'test-form-data'], data);
        },
    });
}
