import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useHistory, useRouteMatch } from 'react-router';

import {
    useDuplicateQuestionSetMutation,
    useQuestionSet,
    useRemoveQuestionSetMutation,
    useUpdateQuestionSetMutation,
} from 'hooks/instructor/ExamQuestionSetHooks';

import { QuestionSetForm } from 'pages/InstructorExamination/components/QuestionSets/QuestionSetForm';
import { ExamQuestionSet } from 'resources/instructor/ExamQuestionSet';
import { QuestionsEditor } from 'pages/InstructorExamination/containers/QuestionSets/QuestionsEditor';
import { QuestionSetDetails } from 'pages/InstructorExamination/components/QuestionSets/QuestionSetDetails';
import { useNotifications } from 'hooks/common/useNotifications';
import { useCourses } from 'hooks/instructor/CourseHooks';
import { useShow } from 'ui-hooks/useShow';

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
    const courses = useCourses(true, false, showEdit.show);

    if (!questionSet.data) {
        return null;
    }

    const handleEditSave = async (data: ExamQuestionSet) => {
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
            history.replace('/instructor/exam');
        } catch (e) {
            // Already handled globally
        }
    };

    const handleDuplicate = async () => {
        try {
            await duplicateMutation.mutateAsync(questionSet.data.id);
            notification.push({
                variant: 'success',
                message: t('examQuestions.successfulDuplicationQuestionSet'),
            });
        } catch (e) {
            // Already handled globally
        }
    };

    const handleNewTest = () => {
        history.push(`${url}/create-test`);
    };

    return (
        <>
            {showEdit.show
                ? (
                    <QuestionSetForm
                        title={t('examQuestions.editQuestionSet')}
                        courses={courses.data}
                        onSave={handleEditSave}
                        onCancel={showEdit.toHide}
                        editData={questionSet.data}
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
