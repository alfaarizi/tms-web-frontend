import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { StudentFile } from 'resources/student/StudentFile';
import {
    useDownloadInstructorFile,
    useDownloadStudentFile,
    useTask,
    useUploadStudentFileMutation, useVerifyStudentFileMutation,
} from 'hooks/student/TaskHooks';
import { TaskDetails } from 'pages/StudentTaskManager/components/TaskDetails';
import { StudentFileDetails } from 'pages/StudentTaskManager/components/StudentFileDetails';
import { InstructorFilesList } from 'components/InstructorFilesList';
import { StudentFileUpload } from 'resources/student/StudentFileUpload';
import { ServerSideValidationError, ValidationErrorBody } from 'exceptions/ServerSideValidationError';
import { FileUpload } from 'components/FileUpload';
import { GitInfo } from 'pages/StudentTaskManager/components/GitInfo';
import { VerifyItemForm } from 'pages/StudentTaskManager/components/VerifyItemForm';
import { VerifyItem } from 'resources/student/VerifyItem';
import { useNotifications } from 'hooks/common/useNotifications';
import { CanvasUploadInfo } from 'pages/StudentTaskManager/components/CanvasUploadInfo';
import { CodeCheckerReportsList } from 'components/CodeChecker/CodeCheckerReportsList';

type Params = {
    id?: string
}

export const TaskPage = () => {
    const { t } = useTranslation();
    const { id } = useParams<Params>();
    const task = useTask(parseInt(id || '-1', 10));
    const uploadMutation = useUploadStudentFileMutation();
    const downloadStudentFile = useDownloadStudentFile();
    const downloadInstructorFile = useDownloadInstructorFile();
    const verifyMutation = useVerifyStudentFileMutation();
    const notifications = useNotifications();
    const [uploadErrorMsg, setUploadErrorMsg] = useState<string | null>(null);
    const [verifyError, setVerifyError] = useState<ValidationErrorBody | null>(null);

    if (!task.data) {
        return null;
    }
    const studentFile: StudentFile = task.data.studentFiles[0];

    const handleStudentFileDownload = () => {
        if (studentFile.name !== undefined) {
            downloadStudentFile.download(studentFile.name, studentFile.id);
        }
    };

    const handleVerify = async (data: VerifyItem) => {
        try {
            await verifyMutation.mutateAsync({ ...data, id: studentFile.id });
            notifications.push(
                {
                    message: t('passwordProtected.verifySuccess'),
                    variant: 'success',
                },
            );
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setVerifyError(e.body);
            }
        }
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
            setUploadErrorMsg(null);
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setUploadErrorMsg(e.body.file[0]);
            }
        }
    };

    let uploadCard;
    if ((DateTime.fromISO(task?.data.hardDeadline) >= DateTime.now() && studentFile.isAccepted !== 'Accepted')
        || studentFile.isAccepted === 'Late Submission') {
        if (task.data.canvasUrl) {
            uploadCard = <CanvasUploadInfo />;
        } else {
            uploadCard = (
                (
                    <FileUpload
                        multiple={false}
                        loading={uploadMutation.isLoading}
                        onUpload={handleSolutionUpload}
                        errorMessages={uploadErrorMsg ? [uploadErrorMsg] : undefined}
                        successCount={uploadMutation.isSuccess ? 1 : 0}
                        accept=".zip"
                    />
                )
            );
        }
    }

    return (
        <>
            <TaskDetails task={task.data} />

            {(!studentFile.verified)
            && (
                <VerifyItemForm
                    onSave={handleVerify}
                    serverSideError={verifyError}
                />
            )}

            {uploadCard}

            {task.data.gitInfo
            && (
                <GitInfo
                    path={task.data.gitInfo.path}
                    usage={task.data.gitInfo.usage}
                    passwordProtected={task.data.passwordProtected}
                />
            )}

            {studentFile.isAccepted !== 'No Submission'
            && (
                <StudentFileDetails
                    studentFile={studentFile}
                    onDownload={handleStudentFileDownload}
                    autoTest={task.data.autoTest}
                />
            )}

            {studentFile?.codeCheckerResult
                && (
                    <CodeCheckerReportsList
                        status={studentFile.codeCheckerResult.status}
                        reports={studentFile.codeCheckerResult.codeCheckerReports}
                    />
                )}

            {task.data.instructorFiles.length !== 0
            && (
                <InstructorFilesList
                    instructorFiles={task.data.instructorFiles}
                    onDownload={handleInstructorFileDownload}
                />
            )}
        </>
    );
};
