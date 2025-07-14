import { useState } from 'react';
import { Breadcrumb, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import { TabbedInterface } from '@/components/TabbedInterface';
import { ServerSideValidationError, ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { useActualSemester } from '@/hooks/common/SemesterHooks';
import { useNotifications } from '@/hooks/common/useNotifications';
import { useGroupsForCourse } from '@/hooks/instructor/GroupHooks';
import {
    useDuplicateTestMutation, useFinalizeTestMutation,
    useRemoveTestMutation,
    useTest,
    useUpdateTestMutation,
} from '@/hooks/instructor/QuizTestHooks';
import { QuizTest } from '@/resources/instructor/QuizTest';
import { TestDetails } from '@/pages/InstructorExamination/components/Tests/TestDetails';
import { TestForm } from '@/pages/InstructorExamination/components/Tests/TestForm';
import { TestQuestionsTab } from '@/pages/InstructorExamination/containers/Tests/TestQuestionsTab';
import { TestResultsTab } from '@/pages/InstructorExamination/containers/Tests/TestResultsTab';
import { UniqueTestQuestionsTab } from '@/pages/InstructorExamination/containers/Tests/UniqueTestQuestionsTab';
import { useShow } from '@/ui-hooks/useShow';
import { StickyBreadcrumb } from '@/components/Header/StickyBreadcrumb';

type Params = {
    id?: string
}

export function TestPage() {
    const { t } = useTranslation();
    const match = useRouteMatch<Params>();
    const history = useHistory();
    const id = parseInt(match.params.id || '-1', 10);
    const test = useTest(id);
    const showEdit = useShow();

    const removeMutation = useRemoveTestMutation();
    const updateMutation = useUpdateTestMutation();
    const duplicateMutation = useDuplicateTestMutation();
    const finalizeMutation = useFinalizeTestMutation();
    const { actualSemesterID } = useActualSemester();
    const groupsForEdit = useGroupsForCourse(
        actualSemesterID || -1,
        test.data?.group?.courseID || -1,
        showEdit.show && !!actualSemesterID,
    );
    const notifications = useNotifications();
    const [editErrorBody, setEditErrorBody] = useState<ValidationErrorBody | null>(null);

    if (!test.data) {
        return null;
    }

    const handleEditSave = async (data: QuizTest) => {
        try {
            await updateMutation.mutateAsync({
                ...data,
                id: test.data.id,
            });
            showEdit.toHide();
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setEditErrorBody(e.body);
            }
        }
    };

    const handleDelete = async () => {
        try {
            await removeMutation.mutateAsync(test.data);
            history.replace('/instructor/quizzes');
        } catch (e) {
            // Already handled globally
        }
    };

    const handleDuplicate = async () => {
        try {
            await duplicateMutation.mutateAsync(test.data.id);
            notifications.push({
                variant: 'success',
                message: t('quizTests.successfulDuplication'),
            });
        } catch (e) {
            // Already handled globally
        }
    };

    const handleFinalize = async () => {
        try {
            await finalizeMutation.mutateAsync(test.data.id);
            notifications.push({
                variant: 'success',
                message: t('quizTests.successfulFinalization'),
            });
        } catch (e) {
            // Already handled globally
        }
    };

    return (
        <>
            <StickyBreadcrumb>
                <LinkContainer to="/instructor/quizzes">
                    <Breadcrumb.Item>{t('navbar.quizzes')}</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to="/instructor/quizzes">
                    <Breadcrumb.Item>{t('quizTests.tests')}</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to={`/instructor/quizzes/tests/${test.data.id}`}>
                    <Breadcrumb.Item active>{test.data.name}</Breadcrumb.Item>
                </LinkContainer>
            </StickyBreadcrumb>
            {showEdit.show
                ? (
                    <TestForm
                        title={t('quizTests.editTest')}
                        onSave={handleEditSave}
                        onCancel={showEdit.toHide}
                        editData={test.data}
                        groups={groupsForEdit.data}
                        serverSideError={editErrorBody}
                        isLoading={updateMutation.isLoading}
                    />
                )
                : (
                    <TestDetails
                        test={test.data}
                        onDuplicate={handleDuplicate}
                        onDelete={handleDelete}
                        onEdit={showEdit.toShow}
                        onFinalize={handleFinalize}
                    />
                )}
            <TabbedInterface defaultActiveKey="results" id="tests-tabs">
                <Tab eventKey="results" title={t('quizTests.results')}>
                    <TestResultsTab test={test.data} />
                </Tab>
                <Tab eventKey="questions" title={t('quizTests.questions')}>
                    {test.data.unique ? <UniqueTestQuestionsTab test={test.data} />
                        : <TestQuestionsTab test={test.data} />}
                </Tab>
            </TabbedInterface>
        </>
    );
}
