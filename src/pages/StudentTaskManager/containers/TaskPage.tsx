import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Submission } from 'resources/student/Submission';
import {
    useDownloadTaskFile,
    useDownloadSubmission, useDownloadTestReport,
    useTask,
    useUploadSubmissionMutation, useVerifySubmissionMutation, useUnlockTaskMutation,
} from 'hooks/student/TaskHooks';
import { TaskDetails } from 'pages/StudentTaskManager/components/TaskDetails';
import { SubmissionDetails } from 'pages/StudentTaskManager/components/SubmissionDetails';
import { TaskFilesList } from 'components/TaskFilesList';
import { SubmissionUpload } from 'resources/student/SubmissionUpload';
import { ServerSideValidationError, ValidationErrorBody } from 'exceptions/ServerSideValidationError';
import { FileUpload } from 'components/FileUpload';
import { GitInfo } from 'pages/StudentTaskManager/components/GitInfo';
import { VerifyItemForm } from 'pages/StudentTaskManager/components/VerifyItemForm';
import { VerifyItem } from 'resources/student/VerifyItem';
import { useNotifications } from 'hooks/common/useNotifications';
import { CanvasUploadInfo } from 'pages/StudentTaskManager/components/CanvasUploadInfo';
import { CodeCheckerReportsList } from 'components/CodeChecker/CodeCheckerReportsList';
import { useCanvasSyncSubmissionMutation } from 'hooks/student/CanvasHooks';
import { useSolutionZipFileCreator } from 'hooks/student/useSolutionZipFileCreator';
import { UnlockItem } from 'resources/student/UnlockItem';

type Params = {
    id?: string
}

export const TaskPage = () => {
    const { t } = useTranslation();
    const { id } = useParams<Params>();
    const taskIDInt = parseInt(id || '-1', 10);
    const task = useTask(taskIDInt);
    const uploadMutation = useUploadSubmissionMutation();
    const downloadSubmission = useDownloadSubmission();
    const downloadTaskFile = useDownloadTaskFile();
    const verifyMutation = useVerifySubmissionMutation();
    const unlockMutation = useUnlockTaskMutation(taskIDInt);
    const notifications = useNotifications();
    const [uploadErrorMsg, setUploadErrorMsg] = useState<string | null>(null);
    const [verifyError, setVerifyError] = useState<ValidationErrorBody | null>(null);
    const [unlockError, setUnlockError] = useState<ValidationErrorBody | null>(null);
    const downloadTestReport = useDownloadTestReport();
    const canvasSyncSubmissionMutation = useCanvasSyncSubmissionMutation(taskIDInt);
    const zipCreator = useSolutionZipFileCreator();
    const [isSubmissionLimitReached, setSubmissionLimitReached] = useState(true);

    useEffect(() => {
        setSubmissionLimitReached(
            task.data !== undefined
            && task.data.isSubmissionCountRestricted
            && task.data.submissions[0].uploadCount >= task.data.submissionLimit,
        );
    }, [task]);

    if (!task.data) {
        return null;
    }
    const submission: Submission = task.data.submissions[0];

    const handleSubmissionDownload = () => {
        if (submission.name !== undefined) {
            downloadSubmission.download(submission.name, submission.id);
        }
    };

    const handleUnlock = async (data: UnlockItem) => {
        try {
            await unlockMutation.mutateAsync({ ...data });
            notifications.push(
                {
                    message: t('passwordProtected.unlockSuccess'),
                    variant: 'success',
                },
            );
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setUnlockError(e.body);
            }
        }
    };

    const handleVerify = async (data: VerifyItem) => {
        try {
            await verifyMutation.mutateAsync({ ...data, id: submission.id });
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

    const handleTaskFileDownload = async (taskID: number, fileName: string) => {
        downloadTaskFile.download(fileName, taskID);
    };

    const handleTestReportDownload = () => {
        downloadTestReport.download(`${submission.id}_report.tar`, submission.id);
    };

    const handleSolutionUpload = async (files: File[]) => {
        try {
            const computedFiles = await zipCreator.zipFilesIfNeeded(files);

            const data: SubmissionUpload = {
                taskID: task.data.id,
                file: computedFiles,
            };
            await uploadMutation.mutateAsync(data);
            setSubmissionLimitReached(
                task.data.isSubmissionCountRestricted && submission.uploadCount <= task.data.submissionLimit,
            );
            setUploadErrorMsg(null);
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setUploadErrorMsg(e.body.file[0]);
            }
        }
    };

    // Synchronize submission with Canvas, if synchronization is set up correctly
    const handleCanvasSync = async () => {
        try {
            await canvasSyncSubmissionMutation.mutateAsync();
            notifications.push({
                variant: 'success',
                message: t('group.successfulCanvasSync'),
            });
        } catch (e) {
            // Already handled globally
        }
    };

    let uploadCard;
    if (((DateTime.fromISO(task?.data.hardDeadline) >= DateTime.now() && submission.status !== 'Accepted')
        || submission.status === 'Late Submission')
        && !isSubmissionLimitReached
        && task.data.entryPasswordUnlocked) {
        if (task.data.canvasUrl) {
            uploadCard = <CanvasUploadInfo />;
        } else {
            uploadCard = (
                (
                    <FileUpload
                        multiple
                        disableUpload={zipCreator.disableUpload}
                        loading={uploadMutation.isLoading}
                        onUpload={handleSolutionUpload}
                        onChange={zipCreator.handleChangedFiles}
                        errorMessages={uploadErrorMsg ? [uploadErrorMsg] : undefined}
                        hintMessage={zipCreator.uploadHintMsg}
                        successCount={uploadMutation.isSuccess ? 1 : 0}
                    />
                )
            );
        }
    }

    return (
        <>
            <TaskDetails
                task={task.data}
                submission={submission}
                canvasSyncInProgress={canvasSyncSubmissionMutation.isLoading}
                onCanvasSync={handleCanvasSync}
                showDescription={task.data.entryPasswordUnlocked ?? true}
            />

            {(!submission.verified && task.data.entryPasswordUnlocked)
            && (
                <VerifyItemForm
                    onSave={handleVerify}
                    serverSideError={verifyError}
                    isLoading={verifyMutation.isLoading}
                    cardTitle={t('passwordProtected.verifyRequired')}
                    cardLabel={t('login.password')}
                    cardWarning={t('passwordProtected.studentWarning')}
                    submitButtonLabel={t('passwordProtected.verify')}
                />
            )}

            {(!task.data.entryPasswordUnlocked)
            && (
                <VerifyItemForm
                    onSave={handleUnlock}
                    serverSideError={unlockError}
                    isLoading={unlockMutation.isLoading}
                    cardTitle={t('passwordProtected.unlockRequired')}
                    cardLabel={t('login.entryPassword')}
                    cardWarning={t('passwordProtected.unlockWarning')}
                    submitButtonLabel={t('passwordProtected.unlock')}
                />
            )}

            {uploadCard}

            {task.data.gitInfo
            && (
                <GitInfo
                    path={task.data.gitInfo.path}
                    usage={task.data.gitInfo.usage}
                    passwordProtected={task.data.exitPasswordProtected}
                />
            )}

            {submission.status !== 'No Submission'
            && (
                <SubmissionDetails
                    submission={submission}
                    onDownload={handleSubmissionDownload}
                    onReportDownload={handleTestReportDownload}
                    autoTest={task.data.autoTest}
                    appType={task.data.appType}
                />
            )}

            {submission?.codeCheckerResult
                && (
                    <CodeCheckerReportsList
                        status={submission.codeCheckerResult.status}
                        reports={submission.codeCheckerResult.codeCheckerReports}
                    />
                )}

            {task.data.taskFiles.length !== 0
            && (
                <TaskFilesList
                    taskFiles={task.data.taskFiles}
                    onDownload={handleTaskFileDownload}
                />
            )}
        </>
    );
};
