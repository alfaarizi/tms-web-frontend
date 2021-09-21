import {
    useInstructorFileDownload,
    useInstructorFiles,
    useInstructorFilesUploadMutation,
    useRemoveInstructorFileMutation,
} from 'hooks/instructor/InstructorFileHooks';
import { FileUpload } from 'components/FileUpload';
import { InstructorFilesUpload } from 'resources/instructor/InstructorFilesUpload';
import { Task } from 'resources/instructor/Task';
import { useActualSemester } from 'hooks/common/SemesterHooks';
import { InstructorFilesList } from 'components/InstructorFilesList';
import { getFirstError } from 'utils/getFirstError';
import React, { useEffect } from 'react';

type Props = {
    task: Task
}

export function InstructorFilesTab({ task }: Props) {
    const actualSemester = useActualSemester();
    const instructorFiles = useInstructorFiles(task.id);
    const removeMutation = useRemoveInstructorFileMutation(task.id);
    const uploadMutation = useInstructorFilesUploadMutation(task.id);
    const downloadInstructorFileMutation = useInstructorFileDownload();

    useEffect(() => {
        uploadMutation.reset();
    }, [task.id]);

    const handleDownload = (id: number, fileName: string) => {
        downloadInstructorFileMutation.download(fileName, id);
    };

    const handleRemove = (id: number) => {
        removeMutation.mutate(id);
    };

    const handleUpload = async (files: File[]) => {
        try {
            const uploadData: InstructorFilesUpload = {
                taskID: task.id,
                files,
            };
            await uploadMutation.mutateAsync(uploadData);
        } catch (e) {
            // Already handled globally
        }
    };

    if (!instructorFiles.data) {
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
                />

                <InstructorFilesList
                    instructorFiles={instructorFiles.data}
                    onDownload={handleDownload}
                    onRemove={handleRemove}
                />
            </>
        )
        : (
            <>
                <InstructorFilesList
                    instructorFiles={instructorFiles.data}
                    onDownload={handleDownload}
                />
            </>
        );
}
