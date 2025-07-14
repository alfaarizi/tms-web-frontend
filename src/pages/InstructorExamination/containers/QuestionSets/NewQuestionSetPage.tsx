import { Breadcrumb } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import { useCourses } from '@/hooks/instructor/CoursesHooks';
import { useCreateQuestionSetMutation } from '@/hooks/instructor/QuizQuestionSetHooks';
import { QuestionSetForm } from '@/pages/InstructorExamination/components/QuestionSets/QuestionSetForm';
import { QuizQuestionSet } from '@/resources/instructor/QuizQuestionSet';
import { StickyBreadcrumb } from '@/components/Header/StickyBreadcrumb';

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
        <>
            <StickyBreadcrumb>
                <LinkContainer to="/instructor/quizzes">
                    <Breadcrumb.Item>{t('navbar.quizzes')}</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to="/instructor/quizzes">
                    <Breadcrumb.Item>{t('quizQuestions.questionSets')}</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to="/instructor/quizzes/question-sets/new">
                    <Breadcrumb.Item active>{t('quizQuestions.createQuestionSet')}</Breadcrumb.Item>
                </LinkContainer>
            </StickyBreadcrumb>
            <QuestionSetForm
                title={t('quizQuestions.createQuestionSet')}
                courses={courses.data}
                onSave={handleSave}
                onCancel={handleSaveCancel}
                isLoading={createMutation.isLoading}
            />
        </>
    );
}
