import React, { useState } from 'react';
import { Task } from 'resources/instructor/Task';
import { useTranslation } from 'react-i18next';
import { useActualSemester } from 'hooks/common/SemesterHooks';
import {
    useSetupAutoTester,
} from 'hooks/instructor/EvaluatorHooks';
import {
    useCreateTestCaseMutation, useExportTestCases, useImportTestCasesMutation, useRemoveTestCaseMutation,
    useTestCases,
    useUpdateTestCaseMutation,
} from 'hooks/instructor/TestCasesHooks';
import { useShow } from 'ui-hooks/useShow';
import { TestCase } from 'resources/instructor/TestCase';
import { SetupAutoTester } from 'resources/instructor/SetupAutoTester';
import {
    AutoTesterSettingsForm,
} from 'pages/InstructorTaskManager/components/Tasks/AutomaticEvaluatorTab/AutoTesterSettingsForm';
import {
    TestCaseFormModal,
} from 'pages/InstructorTaskManager/components/Tasks/AutomaticEvaluatorTab/TestCaseFormModal';
import { TestCaseList } from 'pages/InstructorTaskManager/components/Tasks/AutomaticEvaluatorTab/TestCasesList';
import { EvaluatorAdditionalInformation } from 'resources/instructor/EvaluatorAdditionalInformation';
import { FileUpload } from 'components/FileUpload';
import { getFirstError } from 'utils/getFirstError';
import { ServerSideValidationError } from 'exceptions/ServerSideValidationError';

type Props = {
    task: Task,
    additionalInformation: EvaluatorAdditionalInformation,
}

export function AutoTesterSettings({ task, additionalInformation }: Props) {
    const { t } = useTranslation();
    const actualSemester = useActualSemester();

    // Test settings hooks
    const setupAutoTester = useSetupAutoTester(task.id);

    // Test case hooks
    const testCases = useTestCases(task.id, task.autoTest === 1);
    const createTestCaseMutation = useCreateTestCaseMutation();
    const updateTestCaseMutation = useUpdateTestCaseMutation();
    const removeTestCaseMutation = useRemoveTestCaseMutation();
    const showNewTestCaseModal = useShow();
    const [testCaseToEdit, setTestCaseToEdit] = useState<TestCase | null>(null);
    const exportTestCases = useExportTestCases();
    const importTestCasesMutation = useImportTestCasesMutation(task.id);
    const [uploadErrorMsg, setUploadErrorMsg] = useState<string | null>(null);

    // Save new test case
    const handleSaveNewTestCase = async (data: TestCase) => {
        try {
            await createTestCaseMutation.mutateAsync({
                ...data,
                taskID: task.id,
            });
            showNewTestCaseModal.toHide();
        } catch (e) {
            // Already handled globally
        }
    };

    // Select test case to edit
    const handleTestCaseEditShow = (testCase: TestCase) => {
        setTestCaseToEdit(testCase);
    };

    // Clear selected test case
    const handleTestCaseEditClose = () => {
        setTestCaseToEdit(null);
    };

    // Save edited test case
    const handleTestCaseEditSave = async (data: TestCase) => {
        if (!testCaseToEdit) {
            throw new Error('No test case selected');
        }
        try {
            await updateTestCaseMutation.mutateAsync({
                ...data,
                id: testCaseToEdit.id,
            });
            handleTestCaseEditClose();
        } catch (e) {
            // Already handled globally
        }
    };

    // Delete test case
    const handleTestCaseDelete = (testCase: TestCase) => {
        removeTestCaseMutation.mutate(testCase);
    };

    // Update tester settings
    const handleTestUpdate = async (data: SetupAutoTester) => {
        try {
            await setupAutoTester.mutateAsync(data);
        } catch (e) {
            // Already handled globally
        }
    };

    const handleTestCasesFileUpload = async (files: File[]) => {
        try {
            await importTestCasesMutation.mutateAsync(files[0]);
            setUploadErrorMsg(null);
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setUploadErrorMsg(getFirstError(e.body));
            }
        }
    };

    // Render
    return (
        <>
            {/* Display tester settings */}
            <AutoTesterSettingsForm
                task={task}
                additionalInformation={additionalInformation}
                onSave={handleTestUpdate}
                saveInProgress={setupAutoTester.isLoading}
                updateInProgress={setupAutoTester.isLoading}
                isActualSemester={actualSemester.check(task.semesterID)}
            />

            {/* Display test cases */}
            {task.appType !== 'Web'
                ? (
                    <>
                        <TestCaseList
                            task={task}
                            onExportTestCases={exportTestCases.download}
                            testCases={testCases.data}
                            onNew={showNewTestCaseModal.toShow}
                            onEdit={handleTestCaseEditShow}
                            onDelete={handleTestCaseDelete}
                            isActualSemester={actualSemester.check(task.semesterID)}
                        />
                        <FileUpload
                            multiple={false}
                            loading={importTestCasesMutation.isLoading}
                            onUpload={handleTestCasesFileUpload}
                            errorMessages={uploadErrorMsg ? [uploadErrorMsg] : undefined}
                            successCount={importTestCasesMutation.isSuccess ? 1 : 0}
                            accept=".xls,.csv"
                            hintMessage={t('task.evaluator.testCaseUpload')}
                        />
                    </>

                ) : null}

            {/* Modal to create new test case */}
            <TestCaseFormModal
                title={t('task.evaluator.newTestCase')}
                show={showNewTestCaseModal.show}
                onSave={handleSaveNewTestCase}
                onCancel={showNewTestCaseModal.toHide}
            />

            {/* Modal to edit existing test case */}
            <TestCaseFormModal
                title={t('task.evaluator.editTestCase')}
                show={!!testCaseToEdit}
                editData={testCaseToEdit}
                onSave={handleTestCaseEditSave}
                onCancel={handleTestCaseEditClose}
            />
        </>
    );
}
