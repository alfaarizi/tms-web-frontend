import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Alert, Breadcrumb } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import { CodeCheckerReportsList } from '@/components/CodeChecker/CodeCheckerReportsList';
import { FileUpload } from '@/components/FileUpload';
import { TaskFilesList } from '@/components/TaskFilesList';
import { VerifyItemForm } from '@/components/VerifyItemForm';
import { ServerSideValidationError, ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { useNotifications } from '@/hooks/common/useNotifications';
import { useCanvasSyncSubmissionMutation } from '@/hooks/student/CanvasHooks';
import { useGroup } from '@/hooks/student/GroupHooks';
import {
    useDownloadTaskFile,
    useDownloadSubmission, useDownloadTestReport,
    useTask,
    useUploadSubmissionMutation, useVerifySubmissionMutation, useUnlockTaskMutation,
} from '@/hooks/student/TaskHooks';
import { useSolutionZipFileCreator } from '@/hooks/student/useSolutionZipFileCreator';
import { CanvasUploadInfo } from '@/pages/StudentTaskManager/components/CanvasUploadInfo';
import { GitInfo } from '@/pages/StudentTaskManager/components/GitInfo';
import { SubmissionDetails } from '@/pages/StudentTaskManager/components/SubmissionDetails';
import { TaskDetails } from '@/pages/StudentTaskManager/components/TaskDetails';
import { SubmissionUpload } from '@/resources/student/SubmissionUpload';
import { UnlockItem } from '@/resources/student/UnlockItem';
import { VerifyItem } from '@/resources/student/VerifyItem';
import { StickyBreadcrumb } from '@/components/Header/StickyBreadcrumb';

type Params = {
    id?: string
}

export function TaskPage() {
    const { t } = useTranslation();
    const { id } = useParams<Params>();
    const taskIDInt = parseInt(id || '-1', 10);
    const task = useTask(taskIDInt);
    const group = useGroup(task.data?.groupID || -1);
    const uploadMutation = useUploadSubmissionMutation();
    const downloadSubmission = useDownloadSubmission();
    const downloadTaskFile = useDownloadTaskFile();
    const verifyMutation = useVerifySubmissionMutation();
    const unlockMutation = useUnlockTaskMutation(taskIDInt);
    const notifications = useNotifications();
    const [uploadErrorMsg, setUploadErrorMsg] = useState<string[] | null>(null);
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
            && task.data.submission.uploadCount >= task.data.submissionLimit
            && !task.data.submission.personalDeadline,
        );
    }, [task]);

    if (!task.data) {
        return null;
    }
    const { submission } = task.data;

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
            await verifyMutation.mutateAsync({
                ...data,
                id: submission.id,
            });
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
                setUploadErrorMsg(e.body.file);
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
    const withinDeadline = DateTime.fromISO(task?.data.hardDeadline) >= DateTime.now()
        || DateTime.fromISO(submission?.personalDeadline ?? '') >= DateTime.now();
    if (withinDeadline
        && submission.status !== 'Accepted'
        && !isSubmissionLimitReached
        && task.data.entryPasswordUnlocked
        && task.data.isIpAddressAllowed) {
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
                        errorMessages={uploadErrorMsg || undefined}
                        hintMessage={zipCreator.uploadHintMsg}
                        successCount={uploadMutation.isSuccess ? 1 : 0}
                    />
                )
            );
        }
    }

    return (
        <>
            {group.data ? (
                <StickyBreadcrumb>
                    <LinkContainer to="/student/task-manager">
                        <Breadcrumb.Item>{t('navbar.taskmanager')}</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to={`/student/task-manager/groups/${group.data.id}`}>
                        <Breadcrumb.Item>{`${group.data.course.name} (#${group.data.number})`}</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to={`/student/task-manager/tasks/${task.data.id}`}>
                        <Breadcrumb.Item active>{task.data.name}</Breadcrumb.Item>
                    </LinkContainer>
                </StickyBreadcrumb>
            ) : null}
            <TaskDetails
                task={task.data}
                submission={submission}
                canvasSyncInProgress={canvasSyncSubmissionMutation.isLoading}
                onCanvasSync={handleCanvasSync}
                showDescription={(task.data.entryPasswordUnlocked && task.data.isIpAddressAllowed) ?? true}
            />

            {(!task.data.isIpAddressAllowed) && (
                <Alert variant="danger">
                    <h5>{t('task.ipDisallowed.title')}</h5>
                    <hr />
                    <p>{t('task.ipDisallowed.description')}</p>
                </Alert>
            )}

            {(!submission.verified && task.data.entryPasswordUnlocked && task.data.isIpAddressAllowed)
                && (
                    <VerifyItemForm
                        onSave={handleVerify}
                        serverSideError={verifyError}
                        isLoading={verifyMutation.isLoading}
                        cardTitle={t('passwordProtected.verifyRequired')}
                        cardLabel={t('task.exitPassword')}
                        cardWarning={t('passwordProtected.studentWarning')}
                        submitButtonLabel={t('passwordProtected.verify')}
                        hasIpCheck
                    />
                )}

            {(!task.data.entryPasswordUnlocked && task.data.isIpAddressAllowed)
                && (
                    <VerifyItemForm
                        onSave={handleUnlock}
                        serverSideError={unlockError}
                        isLoading={unlockMutation.isLoading}
                        cardTitle={t('passwordProtected.unlockRequired')}
                        cardLabel={t('task.entryPassword')}
                        cardWarning={t('passwordProtected.unlockWarning')}
                        submitButtonLabel={t('passwordProtected.unlock')}
                        hasIpCheck={false}
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
}
