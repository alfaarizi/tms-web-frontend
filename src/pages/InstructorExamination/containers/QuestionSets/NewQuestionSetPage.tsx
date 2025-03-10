import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { QuestionSetForm } from 'pages/InstructorExamination/components/QuestionSets/QuestionSetForm';
import { QuizQuestionSet } from 'resources/instructor/QuizQuestionSet';
import { useCreateQuestionSetMutation } from 'hooks/instructor/QuizQuestionSetHooks';
import { useCourses } from 'hooks/instructor/CoursesHooks';

export function NewQuestionSetPage() {
    const { t } = useTranslation();
    const createMutation = useCreateQuestionSetMutation();
    const history = useHistory();
    const courses = useCourses(false, true, false);

    const handleSave = async (data: QuizQuestionSet) => {
        try {
            const res = await createMutation.mutateAsync(data);
            history.replace(`./${res.id}`);
        } catch (e) {
            // Already handled globally
        }
    };

    const handleSaveCancel = () => {
        history.push('/instructor/quizzes');
    };

    return (
        <QuestionSetForm
            title={t('quizQuestions.createQuestionSet')}
            courses={courses.data}
            onSave={handleSave}
            onCancel={handleSaveCancel}
            isLoading={createMutation.isLoading}
        />
    );
}
