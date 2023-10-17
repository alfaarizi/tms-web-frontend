import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Tab } from 'react-bootstrap';

import {
    useDuplicateTestMutation, useFinalizeTestMutation,
    useRemoveTestMutation,
    useTest,
    useUpdateTestMutation,
} from 'hooks/instructor/ExamTestHooks';
import { useShow } from 'ui-hooks/useShow';
import { ExamTest } from 'resources/instructor/ExamTest';
import { TestForm } from 'pages/InstructorExamination/components/Tests/TestForm';
import { TestResultsTab } from 'pages/InstructorExamination/containers/Tests/TestResultsTab';
import { TestQuestionsTab } from 'pages/InstructorExamination/containers/Tests/TestQuestionsTab';
import { UniqueTestQuestionsTab } from 'pages/InstructorExamination/containers/Tests/UniqueTestQuestionsTab';
import { TestDetails } from 'pages/InstructorExamination/components/Tests/TestDetails';
import { useGroupsForCourse } from 'hooks/instructor/GroupHooks';
import { useActualSemester } from 'hooks/common/SemesterHooks';
import { TabbedInterface } from 'components/TabbedInterface';
import { useNotifications } from 'hooks/common/useNotifications';
import { ServerSideValidationError, ValidationErrorBody } from 'exceptions/ServerSideValidationError';

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
        test.data?.courseID || -1,
        showEdit.show && !!actualSemesterID,
    );
    const notifications = useNotifications();
    const [editErrorBody, setEditErrorBody] = useState<ValidationErrorBody | null>(null);

    if (!test.data) {
        return null;
    }

    const handleEditSave = async (data: ExamTest) => {
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
            history.replace('/instructor/exam');
        } catch (e) {
            // Already handled globally
        }
    };

    const handleDuplicate = async () => {
        try {
            await duplicateMutation.mutateAsync(test.data.id);
            notifications.push({
                variant: 'success',
                message: t('examTests.successfulDuplication'),
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
                message: t('examTests.successfulFinalization'),
            });
        } catch (e) {
            // Already handled globally
        }
    };

    return (
        <>
            {showEdit.show
                ? (
                    <TestForm
                        title={t('examTests.editTest')}
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
                <Tab eventKey="results" title={t('examTests.results')}>
                    <TestResultsTab test={test.data} />
                </Tab>
                <Tab eventKey="questions" title={t('examTests.questions')}>
                    {test.data.unique ? <UniqueTestQuestionsTab test={test.data} />
                        : <TestQuestionsTab test={test.data} />}
                </Tab>
            </TabbedInterface>
        </>
    );
}
