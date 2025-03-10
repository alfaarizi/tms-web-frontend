import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as CoursesService from 'api/admin/CoursesService';
import * as InstructorCoursesService from 'api/instructor/CoursesService';
import { User } from 'resources/common/User';
import { Course } from 'resources/common/Course';
import { CreateOrUpdateCourse } from 'resources/common/CreateOrUpdateCourse';

export const ADMIN_QUERY_KEY = 'admin/courses';
export const INSTRUCTOR_QUERY_KEY = 'instructor/courses';

export function useCourse(courseID: number) {
    return useQuery([INSTRUCTOR_QUERY_KEY, { courseID }], () => InstructorCoursesService.view(courseID));
}

export function useCourses(isAdmin: boolean, instructor: boolean, forGroups: boolean, enabled: boolean = true) {
    return useQuery(
        isAdmin ? [ADMIN_QUERY_KEY] : [INSTRUCTOR_QUERY_KEY],
        () => (isAdmin
            ? CoursesService.index()
            : InstructorCoursesService.index(instructor, forGroups)),
        { enabled },
    );
}

export function useCreateCourseMutation() {
    const queryClient = useQueryClient();

    return useMutation((uploadData: CreateOrUpdateCourse) => CoursesService.create(uploadData), {
        onSuccess: async (data) => {
            const oldCourses = queryClient.getQueryData<Course[]>(ADMIN_QUERY_KEY);
            if (oldCourses) {
                queryClient.setQueryData(ADMIN_QUERY_KEY, [...oldCourses, data]);
            }
        },
    });
}

export function useUpdateCourseMutation(id: number) {
    const queryClient = useQueryClient();

    return useMutation((uploadData: CreateOrUpdateCourse) => InstructorCoursesService.update(id, uploadData), {
        onSuccess: (data) => {
            // Update course info with the returned data
            const key = [INSTRUCTOR_QUERY_KEY, { courseID: data.id }];
            const oldCourse = queryClient.getQueryData<Course[]>(key);
            if (oldCourse) {
                queryClient.setQueryData(key, data);
            }

            // Update course list with the returned data
            const oldCourses = queryClient.getQueryData<Course[]>(INSTRUCTOR_QUERY_KEY);

            if (oldCourses) {
                const newList = oldCourses.map((course) => (course.id === data.id ? data : course));
                queryClient.setQueryData(INSTRUCTOR_QUERY_KEY, newList);
            }
        },
    });
}

export function useCourseLecturers(courseID: number) {
    return useQuery<User[]>(
        [INSTRUCTOR_QUERY_KEY, 'lecturers', { courseID }],
        () => InstructorCoursesService.listLecturers(courseID),
    );
}

export function useAddLecturerMutation(courseID: number) {
    const queryClient = useQueryClient();

    return useMutation((userCodes: string[]) => InstructorCoursesService.addLecturers(courseID, userCodes), {
        onSuccess: (data) => {
            const key = [INSTRUCTOR_QUERY_KEY, 'lecturers', { courseID }];
            const oldList = queryClient.getQueryData<User[]>(key);
            if (oldList) {
                queryClient.setQueryData(key, [...oldList, ...data.addedUsers]);
            }
        },
    });
}

export function useDeleteLecturerMutation(courseID: number) {
    const queryClient = useQueryClient();

    return useMutation((lecturerID: number) => InstructorCoursesService.removeLecturer(courseID, lecturerID), {
        onSuccess: (_data, lecturerID) => {
            const key = [INSTRUCTOR_QUERY_KEY, 'lecturers', { courseID }];
            const oldList = queryClient.getQueryData<User[]>(key);
            if (oldList) {
                queryClient.setQueryData(key, oldList.filter((user) => user.id !== lecturerID));
            }
        },
    });
}
