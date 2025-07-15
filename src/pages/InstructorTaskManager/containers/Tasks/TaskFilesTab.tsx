import {
    useAttachmentTaskFiles,
    useTaskFileDownload,
    useAttachmentTaskFilesUploadMutation,
    useAttachmentTaskFileRemoveMutation,
} from '@/hooks/instructor/TaskFileHooks';
import { FileUpload } from '@/components/FileUpload';
import { TaskFilesUpload } from '@/resources/instructor/TaskFilesUpload';
import { Task } from '@/resources/instructor/Task';
import { useActualSemester } from '@/hooks/common/SemesterHooks';
import { TaskFilesList } from '@/components/TaskFilesList';
import { getFirstError } from '@/utils/getFirstError';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    task: Task
}

export function TaskFilesTab({ task }: Props) {
    const { t } = useTranslation();
    const actualSemester = useActualSemester();
    const taskFiles = useAttachmentTaskFiles(task.id);
    const removeMutation = useAttachmentTaskFileRemoveMutation(task.id);
    const uploadMutation = useAttachmentTaskFilesUploadMutation(task.id);
    const downloadTaskFileMutation = useTaskFileDownload();

    useEffect(() => {
        uploadMutation.reset();
    }, [task.id]);

    const handleDownload = (id: number, fileName: string) => {
        downloadTaskFileMutation.download(fileName, id);
    };

    const handleRemove = (id: number) => {
        removeMutation.mutate(id);
    };

    const handleUpload = async (files: File[], overwrite : boolean) => {
        try {
            const uploadData: TaskFilesUpload = {
                taskID: task.id,
                category: 'Attachment',
                files,
                overwrite,
            };
            await uploadMutation.mutateAsync(uploadData);
        } catch (e) {
            // Already handled globally
        }
    };

    if (!taskFiles.data) {
        return null;
    }

    const failedToUpload: string[] | undefined = uploadMutation.data
        ?.failed.map((f) => {
            const firstError = getFirstError(f.cause);
            if (firstError) {
                return `${f.name}: ${firstError}`;
            }
            return f.name;
        });

    return actualSemester.check(task.semesterID) && task.category !== 'Canvas tasks'
        ? (
            <>
                <FileUpload
                    multiple
                    loading={uploadMutation.isLoading}
                    onUpload={handleUpload}
                    errorMessages={failedToUpload}
                    successCount={uploadMutation.data ? uploadMutation.data.uploaded.length : 0}
                    hintMessage={t('task.taskFilesHelp')}
                    overwritable
                />

                <TaskFilesList
                    taskFiles={taskFiles.data}
                    onDownload={handleDownload}
                    onRemove={handleRemove}
                />
            </>
        )
        : (
            <TaskFilesList
                taskFiles={taskFiles.data}
                onDownload={handleDownload}
            />
        );
}
