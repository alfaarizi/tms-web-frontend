import { useMutation, useQuery, useQueryClient } from 'react-query';

import * as GroupService from 'api/instructor/GroupsService';
import { Group } from 'resources/instructor/Group';
import { AxiosError } from 'axios';
import { User } from 'resources/common/User';
import { QUERY_KEY as TASK_QUERY_KEY } from 'hooks/instructor/TaskHooks';
import { StudentNotes } from 'resources/instructor/StudentNotes';

export const QUERY_KEY = 'instructor/groups';

export function useGroup(groupID: number) {
    return useQuery<Group>([QUERY_KEY, { groupID }], () => GroupService.view(groupID));
}

export function useGroups(semesterID: number, enabled: boolean = true) {
    return useQuery<Group[]>([QUERY_KEY, { semesterID }], () => GroupService.index(semesterID), {
        enabled,
    });
}

export function useGroupsForCourse(semesterID: number, courseID: number, enabled: boolean = true) {
    return useQuery<Group[]>([QUERY_KEY, 'forCourse', {
        semesterID,
        courseID,
    }], () => GroupService.index(semesterID, courseID), {
        enabled,
    });
}

export function useCreateGroupMutation() {
    const queryClient = useQueryClient();

    return useMutation<Group, AxiosError, Group>((uploadData) => GroupService.create(uploadData), {
        onSuccess: async (data) => {
            const key = [QUERY_KEY, { semesterID: data.semesterID }];

            // Add group to the sidebar
            const oldGroups = queryClient.getQueryData<Group[]>(key);
            if (oldGroups) {
                queryClient.setQueryData(key, [...oldGroups, data]);
            } else {
                queryClient.setQueryData(key, [data]);
            }

            await queryClient.invalidateQueries([QUERY_KEY, 'forCourse']);
        },
    });
}

export function useUpdateGroupMutation() {
    const queryClient = useQueryClient();

    return useMutation<Group, AxiosError, Group>((uploadData) => GroupService.update(uploadData), {
        onSuccess: async (data) => {
            // Update group info with the returned data
            const key = [QUERY_KEY, { groupID: data.id }];
            const oldGroup = queryClient.getQueryData<Group[]>(key);
            if (oldGroup) {
                queryClient.setQueryData(key, data);
            }

            // Update group list with the returned data
            const groupsKey = [QUERY_KEY, { semesterID: data.semesterID }];
            const oldGroups = queryClient.getQueryData<Group[]>(groupsKey);

            if (oldGroups) {
                const newList = oldGroups.map((group) => (group.id === data.id ? data : group));
                queryClient.setQueryData(groupsKey, newList);
            }
            await queryClient.invalidateQueries([QUERY_KEY, 'forCourse']);
        },
    });
}

export function useRemoveGroupMutation() {
    const queryClient = useQueryClient();

    return useMutation((group: Group) => GroupService.remove(group.id), {
        onSuccess: async (_data, variable) => {
            const key = [QUERY_KEY, { semesterID: variable.semesterID }];
            const oldGroups = queryClient.getQueryData<Group[]>(key);

            if (oldGroups) {
                queryClient.setQueryData(key, oldGroups.filter((group) => group.id !== variable.id));
            }

            await queryClient.invalidateQueries([QUERY_KEY, 'forCourse']);
        },
    });
}

export function useDuplicateGroupMutation() {
    const queryClient = useQueryClient();

    return useMutation((group: Group) => GroupService.duplicate(group.id), {
        onSuccess: async (data) => {
            const key = [QUERY_KEY, { semesterID: data.semesterID }];

            const oldGroups = queryClient.getQueryData<Group[]>(key);
            if (oldGroups) {
                queryClient.setQueryData(key, [...oldGroups, data]);
            }

            await queryClient.invalidateQueries([QUERY_KEY, 'forCourse']);
        },
    });
}

export function useGroupStudents(groupID: number) {
    return useQuery<User[]>([QUERY_KEY, 'students', { groupID }], () => GroupService.listStudents(groupID));
}

export function useGroupStudentNotes(groupID: number, studentID: number, enabled : boolean = true) {
    return useQuery([QUERY_KEY, 'notes', {
        groupID,
        studentID,
    }], () => GroupService.studentNotes(groupID, studentID),
    {
        enabled,
    });
}

export function useGroupStudentNotesMutation(groupID: number, studentID: number) {
    const queryClient = useQueryClient();

    return useMutation((notes: string) => GroupService.addStudentNotes(groupID, studentID, notes), {
        onSuccess: (data) => {
            const key = [QUERY_KEY, 'notes', { groupID, studentID }];
            queryClient.setQueryData(key, data.notes);
        },
    });
}

export function useAddStudentsMutation(groupID: number) {
    const queryClient = useQueryClient();

    return useMutation((neptunCodes: string[]) => GroupService.addStudents(groupID, neptunCodes), {
        onSuccess: async (data) => {
            const key = [QUERY_KEY, 'students', { groupID }];
            const oldList = queryClient.getQueryData<User[]>(key);
            if (oldList) {
                queryClient.setQueryData(key, [...oldList, ...data.addedUsers]);
            }
            await queryClient.invalidateQueries([TASK_QUERY_KEY, { groupID }, 'grid']);
        },
    });
}

export function useDeleteStudentMutation(groupID: number) {
    const queryClient = useQueryClient();

    return useMutation((studentID: number) => GroupService.removeStudent(groupID, studentID), {
        onSuccess: async (_data, studentID) => {
            const key = [QUERY_KEY, 'students', { groupID }];
            const oldList = queryClient.getQueryData<User[]>(key);
            if (oldList) {
                queryClient.setQueryData(key, oldList.filter((user) => user.id !== studentID));
            }
            await queryClient.invalidateQueries([TASK_QUERY_KEY, { groupID }, 'grid']);
        },
    });
}

export function useGroupInstructors(groupID: number) {
    return useQuery<User[]>([QUERY_KEY, 'instructors', { groupID }], () => GroupService.listInstructors(groupID));
}

export function useAddInstructorsMutation(groupID: number) {
    const queryClient = useQueryClient();

    return useMutation((neptunCodes: string[]) => GroupService.addInstructors(groupID, neptunCodes), {
        onSuccess: (data) => {
            const key = [QUERY_KEY, 'instructors', { groupID }];
            const oldList = queryClient.getQueryData<User[]>(key);
            if (oldList) {
                queryClient.setQueryData(key, [...oldList, ...data.addedUsers]);
            }
        },
    });
}

export function useDeleteInstructorMutation(groupID: number) {
    const queryClient = useQueryClient();

    return useMutation((instructorID: number) => GroupService.removeInstructor(groupID, instructorID), {
        onSuccess: (_data, instructorID) => {
            const key = [QUERY_KEY, 'instructors', { groupID }];
            const oldList = queryClient.getQueryData<User[]>(key);
            if (oldList) {
                queryClient.setQueryData(key, oldList.filter((user) => user.id !== instructorID));
            }
        },
    });
}

export function useGroupStats(groupID: number) {
    return useQuery([QUERY_KEY, 'stats', { groupID }], () => GroupService.groupStats(groupID));
}

export function useStudentStats(groupID: number, studentID: number) {
    return useQuery([QUERY_KEY, 'stats', {
        groupID,
        studentID,
    }], () => GroupService.studentStats(groupID, studentID));
}
