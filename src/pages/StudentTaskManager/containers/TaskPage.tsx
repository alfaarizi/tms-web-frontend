import React from 'react';
import { useParams } from 'react-router-dom';

import {
    useDownloadInstructorFile,
    useDownloadStudentFile,
    useTask,
    useUploadStudentFileMutation,
} from 'hooks/student/TaskHooks';
import { TaskDetails } from 'pages/StudentTaskManager/components/TaskDetails';
import { StudentFileDetails } from 'pages/StudentTaskManager/components/StudentFileDetails';
import { InstructorFilesList } from 'components/InstructorFilesList';
import { StudentFileUpload } from 'resources/student/StudentFileUpload';
import { ServerSideValidationError } from 'exceptions/ServerSideValidationError';
import { FileUpload } from 'components/FileUpload';
import { GitInfo } from 'pages/StudentTaskManager/components/GitInfo';

type Params = {
    id?: string
}

export const TaskPage = () => {
    const { id } = useParams<Params>();
    const task = useTask(parseInt(id || '-1', 10));
    const uploadMutation = useUploadStudentFileMutation();
    const downloadStudentFile = useDownloadStudentFile();
    const downloadInstructorFile = useDownloadInstructorFile();

    if (!task.data) {
        return null;
    }
    const studentFile = task.data.studentFiles[0];

    const handleStudentFileDownload = () => {
        downloadStudentFile.download(studentFile.name, studentFile.id);
    };

    const handleInstructorFileDownload = async (taskID: number, fileName: string) => {
        downloadInstructorFile.download(fileName, taskID);
    };

    const handleSolutionUpload = async (files: File[]) => {
        try {
            const data: StudentFileUpload = {
                taskID: task.data.id,
                file: files[0],
            };
            await uploadMutation.mutateAsync(data);
        } catch (e) {
            // Already handled globally
        }
    };

    let uploadErrorMsg;
    if (uploadMutation.error && uploadMutation.error instanceof ServerSideValidationError) {
        const { error } = uploadMutation;
        [uploadErrorMsg] = error.body.file;
    }

    return (
        <>
            <TaskDetails task={task.data} />

            {new Date(task?.data.hardDeadline) >= new Date()
                && studentFile?.isAccepted !== 'Accepted'
                && task.data.category !== 'Canvas tasks'
                ? (
                    <FileUpload
                        multiple={false}
                        loading={uploadMutation.isLoading}
                        onUpload={handleSolutionUpload}
                        errorMessages={uploadErrorMsg ? [uploadErrorMsg] : undefined}
                        successCount={uploadMutation.isSuccess ? 1 : 0}
                        accept=".zip"
                    />
                )
                : null}

            {task.data.gitInfo
                ? <GitInfo path={task.data.gitInfo.path} usage={task.data.gitInfo.usage} />
                : null}

            <StudentFileDetails
                studentFile={studentFile}
                onDownload={handleStudentFileDownload}
                autoTest={task.data.autoTest}
            />

            <InstructorFilesList
                instructorFiles={task.data.instructorFiles}
                onDownload={handleInstructorFileDownload}
            />
        </>
    );
};
