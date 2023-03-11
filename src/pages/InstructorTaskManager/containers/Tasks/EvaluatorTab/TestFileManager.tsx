import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Task } from 'resources/instructor/Task';
import { getFirstError } from 'utils/getFirstError';
import { InstructorFilesUpload } from 'resources/instructor/InstructorFilesUpload';
import {
    useInstructorFileDownload,
    useTestInstructorFileRemoveMutation,
    useTestInstructorFiles,
    useTestInstructorFilesUploadMutation,
} from 'hooks/instructor/InstructorFileHooks';
import { FileUpload } from 'components/FileUpload';
import { InstructorFilesList } from 'components/InstructorFilesList';
import { useActualSemester } from 'hooks/common/SemesterHooks';

type Props = {
    task: Task
}

export function TestFileManager({ task }: Props) {
    const { t } = useTranslation();
    const actualSemester = useActualSemester();

    const testFiles = useTestInstructorFiles(task.id);
    const removeTestFileMutation = useTestInstructorFileRemoveMutation(task.id);
    const uploadTestFileMutation = useTestInstructorFilesUploadMutation(task.id);
    const downloadTestFileMutation = useInstructorFileDownload();

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

    useEffect(() => {
        uploadTestFileMutation.reset();
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

    if (actualSemester.check(task.semesterID)) {
        return (
            <>
                <FileUpload
                    multiple
                    loading={uploadTestFileMutation.isLoading}
                    onUpload={handleTestFileUpload}
                    errorMessages={failedToUploadTestFile}
                    successCount={uploadTestFileMutation.data ? uploadTestFileMutation.data.uploaded.length : 0}
                    hintMessage={t('task.evaluator.testFilesHelp')}
                />

                <InstructorFilesList
                    instructorFiles={testFiles.data}
                    onDownload={handleTestFileDownload}
                    onRemove={handleTestFileRemove}
                />
            </>
        );
    }
    return (
        <InstructorFilesList
            instructorFiles={testFiles.data}
            onDownload={handleTestFileDownload}
        />
    );
}
