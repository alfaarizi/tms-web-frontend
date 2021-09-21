import { useMutation, useQuery, useQueryClient } from 'react-query';

import * as CoursesService from 'api/admin/CoursesService';
import { User } from 'resources/common/User';
import { Course } from 'resources/common/Course';

export const QUERY_KEY = 'admin/courses';

export function useCourse(courseID: number) {
    return useQuery([QUERY_KEY, { courseID }], () => CoursesService.view(courseID));
}

export function useCourses() {
    return useQuery([QUERY_KEY], () => CoursesService.index());
}

export function useCreateCourseMutation() {
    const queryClient = useQueryClient();

    return useMutation((uploadData: Course) => CoursesService.create(uploadData), {
        onSuccess: async (data) => {
            const oldCourses = queryClient.getQueryData<Course[]>(QUERY_KEY);
            if (oldCourses) {
                queryClient.setQueryData(QUERY_KEY, [...oldCourses, data]);
            }
        },
    });
}

export function useUpdateCourseMutation() {
    const queryClient = useQueryClient();

    return useMutation((uploadData: Course) => CoursesService.update(uploadData), {
        onSuccess: (data) => {
            // Update course info with the returned data
            const key = [QUERY_KEY, { courseID: data.id }];
            const oldCourse = queryClient.getQueryData<Course[]>(key);
            if (oldCourse) {
                queryClient.setQueryData(key, data);
            }

            // Update course list with the returned data
            const oldCourses = queryClient.getQueryData<Course[]>(QUERY_KEY);

            if (oldCourses) {
                const newList = oldCourses.map((course) => (course.id === data.id ? data : course));
                queryClient.setQueryData(QUERY_KEY, newList);
            }
        },
    });
}

export function useCourseLecturers(courseID: number) {
    return useQuery<User[]>(
        [QUERY_KEY, 'lecturers', { courseID }],
        () => CoursesService.listLecturers(courseID),
    );
}

export function useAddLecturerMutation(courseID: number) {
    const queryClient = useQueryClient();

    return useMutation((neptunCodes: string[]) => CoursesService.addLecturers(courseID, neptunCodes), {
        onSuccess: (data) => {
            const key = [QUERY_KEY, 'lecturers', { courseID }];
            const oldList = queryClient.getQueryData<User[]>(key);
            if (oldList) {
                queryClient.setQueryData(key, [...oldList, ...data.addedUsers]);
            }
        },
    });
}

export function useDeleteLecturerMutation(courseID: number) {
    const queryClient = useQueryClient();

    return useMutation((lecturerID: number) => CoursesService.removeLecturer(courseID, lecturerID), {
        onSuccess: (_data, lecturerID) => {
            const key = [QUERY_KEY, 'lecturers', { courseID }];
            const oldList = queryClient.getQueryData<User[]>(key);
            if (oldList) {
                queryClient.setQueryData(key, oldList.filter((user) => user.id !== lecturerID));
            }
        },
    });
}
