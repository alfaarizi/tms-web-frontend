import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Task } from '@/resources/instructor/Task';
import { getFirstError } from '@/utils/getFirstError';
import { TaskFilesUpload } from '@/resources/instructor/TaskFilesUpload';
import {
    useTaskFileDownload,
    useTestTaskFileRemoveMutation,
    useTestTaskFiles,
    useTestTaskFilesUploadMutation,
} from '@/hooks/instructor/TaskFileHooks';
import { FileUpload } from '@/components/FileUpload';
import { TaskFilesList } from '@/components/TaskFilesList';

type Props = {
    task: Task,
    isActualSemester: boolean,
}

export function TestFileManager({ task, isActualSemester }: Props) {
    const { t } = useTranslation();

    const testFiles = useTestTaskFiles(task.id);
    const removeTestFileMutation = useTestTaskFileRemoveMutation(task.id);
    const uploadTestFileMutation = useTestTaskFilesUploadMutation(task.id);
    const downloadTestFileMutation = useTaskFileDownload();

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
            const uploadData: TaskFilesUpload = {
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

    if (isActualSemester) {
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

                <TaskFilesList
                    taskFiles={testFiles.data}
                    onDownload={handleTestFileDownload}
                    onRemove={handleTestFileRemove}
                />
            </>
        );
    }
    return (
        <TaskFilesList
            taskFiles={testFiles.data}
            onDownload={handleTestFileDownload}
        />
    );
}
