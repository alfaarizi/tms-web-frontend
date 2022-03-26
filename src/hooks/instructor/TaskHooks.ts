import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Task } from 'resources/instructor/Task';
import * as TasksService from 'api/instructor/TasksService';
import { TesterFormData } from 'resources/instructor/TesterFormData';
import { SetupTester } from 'resources/instructor/SetupTester';
import { GridTask } from 'resources/instructor/GridTask.php';

export const QUERY_KEY = 'instructor/tasks';

export function useTask(taskID: number) {
    return useQuery<Task>([QUERY_KEY, { taskID }], () => TasksService.one(taskID));
}

export function useTasks(groupID: number) {
    return useQuery<Task[][]>([QUERY_KEY, { groupID }], () => TasksService.index(groupID));
}

export function useTasksForGrid(groupID: number, enabled: boolean = true) {
    return useQuery<GridTask[][]>(
        [QUERY_KEY, { groupID }, 'grid'],
        () => TasksService.getTasksForGrid(groupID),
        {
            enabled,
        },
    );
}

export function useTaskListForCourse(
    courseID: number | 'All', myTasks: boolean, semesterFromID: number, semesterToID: number, enabled: boolean,
) {
    const key = [QUERY_KEY, 'forCourse', {
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

export function useCreateTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation(
        (newData: Task) => TasksService.create(newData), {
            onSuccess: async (data) => {
                queryClient.setQueryData([QUERY_KEY, { taskID: data.id }], data);
                await queryClient.invalidateQueries([QUERY_KEY, { groupID: data.groupID }]);
                await queryClient.invalidateQueries([QUERY_KEY, 'forCourse']);
                await queryClient.invalidateQueries([QUERY_KEY, { groupID: data.groupID }, 'grid']);
            },
        },
    );
}

export function useUpdateTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation((newData: Task) => TasksService.update(newData), {
        onSuccess: async (data) => {
            const key = [QUERY_KEY, { taskID: data.id }];
            queryClient.setQueryData(key, data);

            await queryClient.invalidateQueries([QUERY_KEY, { groupID: data.groupID }]);
            await queryClient.invalidateQueries([QUERY_KEY, 'forCourse']);
            await queryClient.invalidateQueries([QUERY_KEY, { groupID: data.groupID }, 'grid']);
        },
    });
}

export function useRemoveTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation((task: Task) => TasksService.remove(task.id), {
        onSuccess: async (_data, taskToDelete) => {
            await queryClient.invalidateQueries([QUERY_KEY, { groupID: taskToDelete.groupID }]);
            await queryClient.invalidateQueries([QUERY_KEY, 'forCourse']);
            await queryClient.invalidateQueries([QUERY_KEY, { groupID: taskToDelete.groupID }, 'grid']);
        },
    });
}

export function useToggleAutoTesterMutation() {
    const queryClient = useQueryClient();

    return useMutation((taskID: number) => TasksService.toggleAutoTester(taskID), {
        onSuccess: async (autoTest, taskID) => {
            const key = [QUERY_KEY, { taskID }];
            const oldData = await queryClient.getQueryData<Task>(key);
            const newData = {
                ...oldData,
                autoTest,
            };
            queryClient.setQueryData(key, newData);
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

export function useUpdateDockerImageMutation(taskID: number) {
    const queryClient = useQueryClient();

    return useMutation(() => TasksService.updateDockerImage(taskID), {
        onSuccess: async (data) => {
            queryClient.setQueryData([QUERY_KEY, { taskID: data.id }], data);
            await queryClient.invalidateQueries([QUERY_KEY, { taskID }, 'test-form-data']);
        },
    });
}
