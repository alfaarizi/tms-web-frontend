import { useTranslation } from 'react-i18next';
import { TestCaseFormModal } from 'pages/InstructorTaskManager/components/Tasks/TestCaseFormModal';
import React, { useEffect, useState } from 'react';

import { Task } from 'resources/instructor/Task';
import {
    useSetupTesterMutation,
    useTesterFormData,
    useToggleAutoTesterMutation,
    useUpdateDockerImageMutation,
} from 'hooks/instructor/TaskHooks';
import { ToggleCard } from 'components/ToggleCard';
import { TestCaseList } from 'pages/InstructorTaskManager/components/Tasks/TestCasesList';
import {
    useCreateTestCaseMutation, useExportTestCases, useImportTestCasesMutation,
    useRemoveTestCaseMutation,
    useTestCases,
    useUpdateTestCaseMutation,
} from 'hooks/instructor/TestCasesHooks';
import { TestCase } from 'resources/instructor/TestCase';
import { useShow } from 'ui-hooks/useShow';
import { AutoTesterForm } from 'pages/InstructorTaskManager/components/Tasks/AutoTesterForm';
import { SetupTester } from 'resources/instructor/SetupTester';
import { useActualSemester } from 'hooks/common/SemesterHooks';
import { FileUpload } from 'components/FileUpload';
import { InstructorFilesList } from 'components/InstructorFilesList';
import {
    useInstructorFileDownload,
    useTestInstructorFiles,
    useTestInstructorFilesUploadMutation,
    useTestInstructorFileRemoveMutation,
} from 'hooks/instructor/InstructorFileHooks';
import { InstructorFilesUpload } from 'resources/instructor/InstructorFilesUpload';
import { getFirstError } from 'utils/getFirstError';
import { ServerSideValidationError } from 'exceptions/ServerSideValidationError';

type Props = {
    task: Task
}

/**
 * Displays auto tester settings and test cases for the given task
 * @param task
 * @constructor
 */
export function AutoTesterTab({ task }: Props) {
    const { t } = useTranslation();
    const actualSemester = useActualSemester();

    // Tester hooks
    const toggleTesterMutation = useToggleAutoTesterMutation();

    // Test settings hooks
    const testerFormData = useTesterFormData(task.id, task.autoTest === 1);
    const setupMutation = useSetupTesterMutation(task.id);
    const updateDockerImageMutation = useUpdateDockerImageMutation(task.id);

    // Test file hooks
    const testFiles = useTestInstructorFiles(task.id);
    const removeTestFileMutation = useTestInstructorFileRemoveMutation(task.id);
    const uploadTestFileMutation = useTestInstructorFilesUploadMutation(task.id);
    const downloadTestFileMutation = useInstructorFileDownload();

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

    // Turn testing on/off
    const handleToggle = () => {
        toggleTesterMutation.mutate(task.id);
    };

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
    const handleTestUpdate = async (data: SetupTester) => {
        try {
            await setupMutation.mutateAsync(data);
        } catch (e) {
            // Already handled globally
        }
    };

    // Update Docker image from repository
    const handleDockerImageUpdate = async () => {
        try {
            await updateDockerImageMutation.mutateAsync();
        } catch (e) {
            // Already handled globally
        }
    };

    // Download test file
    const handleTestFileDownload = (id: number, fileName: string) => {
        downloadTestFileMutation.download(fileName, id);
    };

    // Remove test file
    const handleTestFileRemove = (id: number) => {
        removeTestFileMutation.mutate(id);
    };

    // Upload test file
    const handleTestFileUpload = async (files: File[]) => {
        try {
            const uploadData: InstructorFilesUpload = {
                taskID: task.id,
                category: 'Test file',
                files,
            };
            await uploadTestFileMutation.mutateAsync(uploadData);
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

    useEffect(() => {
        uploadTestFileMutation.reset();
        importTestCasesMutation.reset();
    }, [task.id]);

    if (!testFiles.data) {
        return null;
    }

    const failedToUploadTestFile: string[] | undefined = uploadTestFileMutation.data
        ?.failed.map((f) => {
            const firstError = getFirstError(f.cause);
            if (firstError) {
                return `${f.name}: ${firstError}`;
            }
            return f.name;
        });

    // Render
    return (
        <>
            {/* Display toggle */}
            <ToggleCard
                status={task.autoTest === 1}
                toggleID="auto-tester-toggle"
                onToggle={handleToggle}
                disabled={!actualSemester.check(task.semesterID)}
                label={t('task.autoTester.activate')}
            />

            {/* Display tester settings */}
            {task.autoTest && testerFormData.data
                ? (
                    <AutoTesterForm
                        task={task}
                        formData={testerFormData.data}
                        onSave={handleTestUpdate}
                        onUpdateDockerImage={handleDockerImageUpdate}
                        saveInProgress={setupMutation.isLoading}
                        updateInProgress={updateDockerImageMutation.isLoading}
                        isActualSemester={actualSemester.check(task.semesterID)}
                    />
                )
                : null}

            {/* Display test files and upload form */}
            {task.autoTest && actualSemester.check(task.semesterID)
                ? (
                    <>
                        <FileUpload
                            multiple
                            loading={uploadTestFileMutation.isLoading}
                            onUpload={handleTestFileUpload}
                            errorMessages={failedToUploadTestFile}
                            successCount={uploadTestFileMutation.data ? uploadTestFileMutation.data.uploaded.length : 0}
                            hintMessage={t('task.autoTester.testFilesHelp')}
                        />

                        <InstructorFilesList
                            instructorFiles={testFiles.data}
                            onDownload={handleTestFileDownload}
                            onRemove={handleTestFileRemove}
                        />
                    </>
                )
                : null}

            {task.autoTest && !actualSemester.check(task.semesterID)
                ? (
                    <InstructorFilesList
                        instructorFiles={testFiles.data}
                        onDownload={handleTestFileDownload}
                    />
                )
                : null}

            {/* Display test cases */}
            {(task.autoTest && task.appType !== 'Web')
                ? (
                    <>
                        <TestCaseList
                            task={task}
                            testCases={testCases.data}
                            onNew={showNewTestCaseModal.toShow}
                            onEdit={handleTestCaseEditShow}
                            onDelete={handleTestCaseDelete}
                            onExportTestCases={exportTestCases.download}
                            isActualSemester={actualSemester.check(task.semesterID)}
                        />
                        <FileUpload
                            multiple={false}
                            loading={importTestCasesMutation.isLoading}
                            onUpload={handleTestCasesFileUpload}
                            errorMessages={uploadErrorMsg ? [uploadErrorMsg] : undefined}
                            successCount={importTestCasesMutation.isSuccess ? 1 : 0}
                            accept=".xls,.csv"
                            hintMessage={t('task.autoTester.testCaseUpload')}
                        />
                    </>
                ) : null}

            {/* Modal to create new test case */}
            <TestCaseFormModal
                title={t('task.autoTester.newTestCase')}
                show={showNewTestCaseModal.show}
                onSave={handleSaveNewTestCase}
                onCancel={showNewTestCaseModal.toHide}
            />

            {/* Modal to edit existing test case */}
            <TestCaseFormModal
                title={t('task.autoTester.editTestCase')}
                show={!!testCaseToEdit}
                editData={testCaseToEdit}
                onSave={handleTestCaseEditSave}
                onCancel={handleTestCaseEditClose}
            />
        </>
    );
}
