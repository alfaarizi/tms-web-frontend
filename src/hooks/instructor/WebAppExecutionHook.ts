import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as WebAppExecutionService from 'api/instructor/WebAppExecutionService';
import { WebAppExecution } from 'resources/instructor/WebAppExecution';
import { Submission } from 'resources/instructor/Submission';
import { SetupWebAppExecution } from 'resources/instructor/SetupWebAppExecution';
import { useDownloader } from 'hooks/common/useDownloader';

export const QUERY_KEY = 'instructor/web-app-execution';

export function useWebAppExecution(submission: Submission) {
    return useQuery<WebAppExecution>([QUERY_KEY, { submissionID: submission.id }],
        () => WebAppExecutionService.one(submission.id), {
            initialData: submission.execution,
            refetchInterval: 60000,
            refetchIntervalInBackground: false,
        });
}

export function useStartWebAppExecutionMutation(submission: Submission) {
    const queryClient = useQueryClient();

    return useMutation((data: SetupWebAppExecution) => WebAppExecutionService
        .startWebAppExecution(submission.id, data), {
        onSuccess: async (data) => {
            queryClient.setQueryData([QUERY_KEY, { submissionID: submission.id }], data);
        },
    });
}

export function useStopWebAppExecutionMutation(submission: Submission) {
    const queryClient = useQueryClient();

    return useMutation((webAppExecution: WebAppExecution) => WebAppExecutionService
        .stopWebAppExecution(webAppExecution), {
        onSuccess: async (data) => {
            await queryClient.invalidateQueries([QUERY_KEY, { submissionID: submission.id }]);
        },
    });
}
export function useDownloadRunLog() {
    return useDownloader(
        (webAppExecution: WebAppExecution) => WebAppExecutionService.downloadRunLog(webAppExecution),
    );
}
