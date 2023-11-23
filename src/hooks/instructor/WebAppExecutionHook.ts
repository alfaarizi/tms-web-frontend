import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as WebAppExecutionService from 'api/instructor/WebAppExecutionService';
import { WebAppExecution } from 'resources/instructor/WebAppExecution';
import { StudentFile } from 'resources/instructor/StudentFile';
import { SetupWebAppExecution } from 'resources/instructor/SetupWebAppExecution';
import { useDownloader } from 'hooks/common/useDownloader';

export const QUERY_KEY = 'instructor/web-app-execution';

export function useWebAppExecution(studentFile: StudentFile) {
    return useQuery<WebAppExecution>([QUERY_KEY, { studentFileID: studentFile.id }],
        () => WebAppExecutionService.one(studentFile.id), {
            initialData: studentFile.execution,
            refetchInterval: 60000,
            refetchIntervalInBackground: false,
        });
}

export function useStartWebAppExecutionMutation(studentFile: StudentFile) {
    const queryClient = useQueryClient();

    return useMutation((data: SetupWebAppExecution) => WebAppExecutionService
        .startWebAppExecution(studentFile.id, data), {
        onSuccess: async (data) => {
            queryClient.setQueryData([QUERY_KEY, { studentFileID: studentFile.id }], data);
        },
    });
}

export function useStopWebAppExecutionMutation(studentFile: StudentFile) {
    const queryClient = useQueryClient();

    return useMutation((webAppExecution: WebAppExecution) => WebAppExecutionService
        .stopWebAppExecution(webAppExecution), {
        onSuccess: async (data) => {
            await queryClient.invalidateQueries([QUERY_KEY, { studentFileID: studentFile.id }]);
        },
    });
}
export function useDownloadRunLog() {
    return useDownloader(
        (webAppExecution: WebAppExecution) => WebAppExecutionService.downloadRunLog(webAppExecution),
    );
}
