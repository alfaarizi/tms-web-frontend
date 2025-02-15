import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as TestCasesService from '@/api/instructor/TestCasesService';
import { TestCase } from '@/resources/instructor/TestCase';
import { useDownloader } from '@/hooks/common/useDownloader';
import { ExportSpreadsheetParams } from '@/hooks/instructor/SubmissionHooks';

export const QUERY_KEY = 'instructor/test-cases';

export function useTestCases(taskID: number, enabled: boolean = true) {
    return useQuery([QUERY_KEY, { taskID }], () => TestCasesService.index(taskID), {
        enabled,
    });
}

export function useCreateTestCaseMutation() {
    const queryClient = useQueryClient();

    return useMutation((newTestCase: TestCase) => TestCasesService.create(newTestCase), {
        onSuccess: (data) => {
            const key = [QUERY_KEY, { taskID: data.taskID }];

            const oldList = queryClient.getQueryData<TestCase[]>(key);
            if (oldList) {
                queryClient.setQueryData(key, [...oldList, data]);
            }
        },
    });
}

export function useUpdateTestCaseMutation() {
    const queryClient = useQueryClient();

    return useMutation((updatedTestCase: TestCase) => TestCasesService.update(updatedTestCase), {
        onSuccess: (newData) => {
            const key = [QUERY_KEY, { taskID: newData.taskID }];

            const oldList = queryClient.getQueryData<TestCase[]>(key);
            if (oldList) {
                queryClient.setQueryData(
                    key,
                    oldList.map((oldItem) => (oldItem.id === newData.id ? newData : oldItem)),
                );
            }
        },
    });
}

export function useRemoveTestCaseMutation() {
    const queryClient = useQueryClient();

    return useMutation((testCaseToDelete: TestCase) => TestCasesService.remove(testCaseToDelete.id), {
        onSuccess: (_data, testCaseToDelete) => {
            const key = [QUERY_KEY, { taskID: testCaseToDelete.taskID }];

            const oldList = queryClient.getQueryData<TestCase[]>(key);
            if (oldList) {
                queryClient.setQueryData(key, oldList.filter((oldItem) => oldItem.id !== testCaseToDelete.id));
            }
        },
    });
}

export function useExportTestCases() {
    return useDownloader(
        ({ taskID, format }: ExportSpreadsheetParams) => TestCasesService.exportTestCases(taskID, format),
    );
}

export function useImportTestCasesMutation(taskID : number) {
    const queryClient = useQueryClient();

    return useMutation<TestCase[], Error, File>((file : File) => TestCasesService.importTestCases(taskID, file), {
        onSuccess: (data) => {
            const key = [QUERY_KEY, { taskID }];
            const oldList = queryClient.getQueryData<TestCase[]>(key);
            if (oldList) {
                queryClient.setQueryData(key, data);
            }
        },
    });
}
