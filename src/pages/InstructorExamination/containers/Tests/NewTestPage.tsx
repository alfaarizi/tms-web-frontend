import { useState } from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';

import { ServerSideValidationError, ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { useActualSemester } from '@/hooks/common/SemesterHooks';
import { useGroupsForCourse } from '@/hooks/instructor/GroupHooks';
import { useQuestionSet } from '@/hooks/instructor/QuizQuestionSetHooks';
import { useCreateTestMutation } from '@/hooks/instructor/QuizTestHooks';
import { TestForm } from '@/pages/InstructorExamination/components/Tests/TestForm';
import { TestNoGroupCard } from '@/pages/InstructorExamination/components/Tests/TestNoGroupCard';
import { QuizTest } from '@/resources/instructor/QuizTest';

type Params = {
    questionsetID: string
}

export function NewTestPage() {
    const { t } = useTranslation();
    const history = useHistory();
    const params = useParams<Params>();
    const questionsetID = parseInt(params.questionsetID || '-1', 10);

    const questionSet = useQuestionSet(questionsetID);
    const actualSemester = useActualSemester();
    const groups = useGroupsForCourse(
        actualSemester.actualSemesterID || -1,
        questionSet.data?.courseID || -1,
        !!actualSemester.actualSemesterID && !!questionSet.data,
    );
    const createMutation = useCreateTestMutation();
    const [addErrorBody, setAddErrorBody] = useState<ValidationErrorBody | null>(null);

    if (!questionSet.data) {
        return null;
    }

    const handleSave = async (data: QuizTest) => {
        try {
            const responseData = await createMutation.mutateAsync({
                ...data,
                questionsetID,
            });
            history.replace(`/instructor/quizzes/tests/${responseData.id}`);
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setAddErrorBody(e.body);
            }
        }
    };

    const handleSaveCancel = () => {
        history.push(`/instructor/quizzes/question-sets/${questionsetID}`);
    };

    return groups.data !== undefined && groups.data.length > 0
        ? (
            <>
                <Breadcrumb>
                    <LinkContainer to="/instructor/quizzes">
                        <Breadcrumb.Item>{t('navbar.quizzes')}</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to="/instructor/quizzes">
                        <Breadcrumb.Item>{t('quizQuestions.questionSets')}</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to={`/instructor/quizzes/question-sets/${questionSet.data.id}`}>
                        <Breadcrumb.Item>{questionSet.data.name}</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to={`/instructor/quizzes/question-sets/${questionSet.data.id}/create-test`}>
                        <Breadcrumb.Item active>{t('quizTests.newTest')}</Breadcrumb.Item>
                    </LinkContainer>
                </Breadcrumb>
                <TestForm
                    title={t('quizTests.newTest')}
                    groups={groups.data}
                    onSave={handleSave}
                    onCancel={handleSaveCancel}
                    serverSideError={addErrorBody}
                    isLoading={createMutation.isLoading}
                />
            </>
        )
        : <TestNoGroupCard onBackClick={handleSaveCancel} />;
}
