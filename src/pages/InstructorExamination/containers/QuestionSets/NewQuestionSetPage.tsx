import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { QuestionSetForm } from 'pages/InstructorExamination/components/QuestionSets/QuestionSetForm';
import { ExamQuestionSet } from 'resources/instructor/ExamQuestionSet';
import { useCreateQuestionSetMutation } from 'hooks/instructor/ExamQuestionSetHooks';
import { useCourses } from 'hooks/instructor/CourseHooks';

export function NewQuestionSetPage() {
    const { t } = useTranslation();
    const createMutation = useCreateQuestionSetMutation();
    const history = useHistory();
    const courses = useCourses(true, false);

    const handleSave = async (data: ExamQuestionSet) => {
        try {
            const res = await createMutation.mutateAsync(data);
            history.replace(`./${res.id}`);
        } catch (e) {
            // Already handled globally
        }
    };

    const handleSaveCancel = () => {
        history.push('/instructor/exam');
    };

    return (
        <QuestionSetForm
            title={t('examQuestions.createQuestionSet')}
            courses={courses.data}
            onSave={handleSave}
            onCancel={handleSaveCancel}
        />
    );
}
