import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Task } from '@/resources/instructor/Task';
import * as TasksService from '@/api/instructor/TasksService';
import { GridTask } from '@/resources/instructor/GridTask';
import { QUERY_KEY as SUBMISSION_QUERY } from '@/hooks/instructor/SubmissionHooks';
import { CodeCompassParameters } from '@/resources/instructor/CodeCompassParameters';
import { TaskUpdate } from '@/resources/instructor/TaskUpdate';

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
    courseID: number | 'All',
    myTasks: boolean,
    semesterFromID: number,
    semesterToID: number,
    enabled: boolean,
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

    return useMutation((newData: Task) => TasksService.create(newData), {
        onSuccess: async (data) => {
            queryClient.setQueryData([QUERY_KEY, { taskID: data.id }], data);
            await queryClient.invalidateQueries([QUERY_KEY, { groupID: data.groupID }]);
            await queryClient.invalidateQueries([QUERY_KEY, 'forCourse']);
            await queryClient.invalidateQueries([QUERY_KEY, { groupID: data.groupID }, 'grid']);
        },
    });
}

export function useUpdateTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation((newData: TaskUpdate) => TasksService.update(newData), {
        onSuccess: async (data) => {
            const key = [QUERY_KEY, { taskID: data.id }];
            queryClient.setQueryData(key, data);

            await queryClient.invalidateQueries([QUERY_KEY, { groupID: data.groupID }]);
            await queryClient.invalidateQueries([QUERY_KEY, 'forCourse']);
            await queryClient.invalidateQueries([QUERY_KEY, { groupID: data.groupID }, 'grid']);
            await queryClient.invalidateQueries([SUBMISSION_QUERY, { taskID: data.id }]);
            await queryClient.invalidateQueries([SUBMISSION_QUERY, { groupID: data.groupID }]);
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

export function useSetupCodeCompassParserMutation(taskID: number) {
    const queryClient = useQueryClient();

    return useMutation((data: CodeCompassParameters) => TasksService.setupCodeCompassParameters(taskID, data), {
        onSuccess: async (data) => {
            queryClient.setQueryData([QUERY_KEY, { taskID: data.id }], data);
        },
    });
}
