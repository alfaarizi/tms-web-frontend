import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { useSemesters } from 'hooks/common/SemesterHooks';
import { RequestPlagiarism } from 'resources/instructor/RequestPlagiarism';
import { useCourses } from 'hooks/instructor/CourseHooks';
import { useTaskListForCourse, useUserList } from 'hooks/instructor/TaskHooks';
import { useCreatePlagiarismMutation } from 'hooks/instructor/PlagiarismHooks';
import { useHistory } from 'react-router';
import { NewRequestForm, PlagiarismForm } from 'pages/InstructorPlagiarism/components/NewRequestForm';

export function NewRequestPage() {
    const history = useHistory();
    // Setup react hook form
    const formMethods = useForm<PlagiarismForm>({
        defaultValues: {
            ignoreThreshold: 10,
            myTasks: false,
            courseID: 'All',
            selectedStudents: [],
            selectedTasks: [],
            semesterFromID: -1,
            semesterToID: -1,
        },
    });
    // Watch form values
    const [myTasks, semesterFromID, semesterToID, courseID, selectedTasks] = formMethods.watch(
        ['myTasks', 'semesterFromID', 'semesterToID', 'courseID', 'selectedTasks'],
    );

    const createMutation = useCreatePlagiarismMutation();

    // Load data for fields
    const semesters = useSemesters();
    const courses = useCourses(true, true);
    const tasksForCourse = useTaskListForCourse(
        courseID, myTasks, semesterFromID, semesterToID, semesterFromID > -1 && semesterToID > -1,
    );
    const users = useUserList(selectedTasks, selectedTasks.length > 0);

    // Set semester values after page load
    useEffect(() => {
        if (semesters.data && semesters.data.length > 0 && semesterFromID === -1 && semesterToID === -1) {
            formMethods.setValue('semesterFromID', semesters.data[0].id);
            formMethods.setValue('semesterToID', semesters.data[0].id);
        }
    }, [semesters.data]);

    const handleSave = async (data: RequestPlagiarism) => {
        try {
            const resData = await createMutation.mutateAsync(data);
            history.replace(`/instructor/plagiarism/${resData.id}`);
        } catch (e) {
            // Already handled globally
        }
    };

    const handleCancel = () => {
        history.push('/instructor/plagiarism');
    };

    // Render
    return (
        <FormProvider {...formMethods}>
            <NewRequestForm
                onSave={handleSave}
                onCancel={handleCancel}
                semesterToID={semesterToID}
                semesterFromID={semesterFromID}
                courses={courses.data}
                semesters={semesters.data}
                tasks={tasksForCourse.data}
                users={users.data}
            />
        </FormProvider>
    );
}
