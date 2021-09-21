import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Task } from 'resources/instructor/Task';
import * as TasksService from 'api/instructor/TasksService';
import { TesterFormData } from 'resources/instructor/TesterFormData';
import { SetupTester } from 'resources/instructor/SetupTester';

export const QUERY_KEY = 'instructor/tasks';

export function useTask(taskID: number) {
    return useQuery<Task>([QUERY_KEY, { taskID }], () => TasksService.one(taskID));
}

export function useTasks(groupID: number) {
    return useQuery<Task[][]>([QUERY_KEY, { groupID }], () => TasksService.index(groupID));
}

export function useCreateTaskMutation() {
    return useMutation((newData: Task) => TasksService.create(newData));
}

export function useUpdateTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation((newData: Task) => TasksService.update(newData), {
        onSuccess: async (data) => {
            const key = [QUERY_KEY, { taskID: data.id }];
            queryClient.setQueryData(key, data);

            const groupKey = ['instructor/groups', { groupID: data.groupID }];
            await queryClient.invalidateQueries(groupKey);
        },
    });
}

export function useRemoveTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation((task: Task) => TasksService.remove(task.id), {
        onSuccess: async (_data, variables) => {
            const groupKey = ['instructor/groups', { groupID: variables.groupID }];
            await queryClient.invalidateQueries(groupKey);
        },
    });
}

export function useTaskListForCourse(
    courseID: number | 'All', myTasks: boolean, semesterFromID: number, semesterToID: number, enabled: boolean,
) {
    const key = [QUERY_KEY, {
        courseID,
        myTasks,
        semesterFromID,
        semesterToID,
    }];
    return useQuery(
        key,
        () => TasksService.plagiarismListForCourse(courseID, myTasks, semesterFromID, semesterToID),
        { enabled },
    );
}

export function useUserList(taskIDs: number[], enabled: boolean) {
    const key = [QUERY_KEY, 'users', ...taskIDs];
    return useQuery(key, () => TasksService.listUsers(taskIDs), { enabled });
}

export function useToggleAutoTesterMutation() {
    const queryClient = useQueryClient();

    return useMutation((id: number) => TasksService.toggleAutoTester(id), {
        onSuccess: async (data) => {
            const key = [QUERY_KEY, { taskID: data.id }];
            queryClient.setQueryData(key, data);
        },
    });
}

export function useTesterFormData(taskID: number, enabled: boolean) {
    return useQuery<TesterFormData>(
        [QUERY_KEY, { taskID }, 'test-form-data'],
        () => TasksService.testerFormData(taskID), {
            enabled,
        },
    );
}

export function useSetupTesterMutation(taskID: number) {
    const queryClient = useQueryClient();

    return useMutation((data: SetupTester) => TasksService.setupAutoTester(taskID, data), {
        onSuccess: async (data) => {
            queryClient.setQueryData([QUERY_KEY, { taskID: data.id }], data);
            await queryClient.invalidateQueries([QUERY_KEY, { taskID }, 'test-form-data']);
        },
    });
}
