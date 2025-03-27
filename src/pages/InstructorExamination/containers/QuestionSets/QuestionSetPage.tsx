import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useHistory, useRouteMatch } from 'react-router';

import {
    useDuplicateQuestionSetMutation,
    useQuestionSet,
    useRemoveQuestionSetMutation,
    useUpdateQuestionSetMutation,
} from 'hooks/instructor/QuizQuestionSetHooks';

import { QuestionSetForm } from 'pages/InstructorExamination/components/QuestionSets/QuestionSetForm';
import { QuizQuestionSet } from 'resources/instructor/QuizQuestionSet';
import { QuestionsEditor } from 'pages/InstructorExamination/containers/QuestionSets/QuestionsEditor';
import { QuestionSetDetails } from 'pages/InstructorExamination/components/QuestionSets/QuestionSetDetails';
import { useNotifications } from 'hooks/common/useNotifications';
import { useCourses } from 'hooks/instructor/CoursesHooks';
import { useShow } from 'ui-hooks/useShow';
import { useGroupsForCourse } from 'hooks/instructor/GroupHooks';
import { useActualSemester } from 'hooks/common/SemesterHooks';

type Params = {
    id?: string
}

export function QuestionSetPage() {
    const params = useParams<Params>();
    const questionSet = useQuestionSet(parseInt(params.id || '-1', 10));
    const { t } = useTranslation();
    const history = useHistory();
    const { url } = useRouteMatch();
    const showEdit = useShow();
    const updateMutation = useUpdateQuestionSetMutation();
    const removeMutation = useRemoveQuestionSetMutation();
    const duplicateMutation = useDuplicateQuestionSetMutation();
    const notification = useNotifications();
    const courses = useCourses(false, true, false, showEdit.show);
    const actualSemester = useActualSemester();
    const groups = useGroupsForCourse(
        actualSemester.actualSemesterID || -1,
        questionSet.data?.course.id || -1,
        false,
    );

    if (!questionSet.data) {
        return null;
    }

    const handleEditSave = async (data: QuizQuestionSet) => {
        try {
            await updateMutation.mutateAsync({
                ...data,
                id: questionSet.data.id,
            });
            showEdit.toHide();
        } catch (e) {
            // Already handled globally
        }
    };

    const handleDelete = async () => {
        try {
            await removeMutation.mutateAsync(questionSet.data.id);
            history.replace('/instructor/quizzes');
        } catch (e) {
            // Already handled globally
        }
    };

    const handleDuplicate = async () => {
        try {
            await duplicateMutation.mutateAsync(questionSet.data.id);
            notification.push({
                variant: 'success',
                message: t('quizQuestions.successfulDuplicationQuestionSet'),
            });
        } catch (e) {
            // Already handled globally
        }
    };

    const handleNewTest = async () => {
        const result = await groups.refetch();
        if (result.data !== undefined && result.data.length > 0) {
            history.push(`${url}/create-test`);
            return;
        }
        notification.push({
            variant: 'error',
            message: t('quizTests.noGroupCreated'),
        });
    };

    return (
        <>
            {showEdit.show
                ? (
                    <QuestionSetForm
                        title={t('quizQuestions.editQuestionSet')}
                        courses={courses.data}
                        onSave={handleEditSave}
                        onCancel={showEdit.toHide}
                        editData={questionSet.data}
                        isLoading={updateMutation.isLoading}
                    />
                )
                : (
                    <QuestionSetDetails
                        questionSet={questionSet.data}
                        onEdit={showEdit.toShow}
                        onDelete={handleDelete}
                        onDuplicate={handleDuplicate}
                        onNewTest={handleNewTest}
                    />
                )}

            <QuestionsEditor questionSet={questionSet.data} />
        </>
    );
}
