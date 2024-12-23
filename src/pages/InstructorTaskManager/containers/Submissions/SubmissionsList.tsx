import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Submission } from 'resources/instructor/Submission';
import { GraderModal } from 'pages/InstructorTaskManager/components/Submissions/GraderModal';
import { IpLogModal } from 'pages/InstructorTaskManager/containers/Submissions/IpLogModal';
import { useActualSemester } from 'hooks/common/SemesterHooks';
import { useDownloadSubmission, useDownloadTestReport, useGradeMutation } from 'hooks/instructor/SubmissionHooks';
import { SubmissionListItem } from 'pages/InstructorTaskManager/components/Students/SubmissionListItem';
import { useNotifications } from 'hooks/common/useNotifications';
import { Task } from 'resources/instructor/Task';
import { usePrivateSystemInfoQuery } from 'hooks/common/SystemHooks';
import { useHistory } from 'react-router';

type Props = {
    files: Submission[],
    semesterID: number,
    handleStartCodeCompass: (f: Submission) => void
    handleStopCodeCompass: (f: Submission) => void
    renderItem: (f: Submission) => ReactNode
    task?: Task
}

/**
 * Reusable container component for rendering submission lists
 * @param files List of files
 * @param semesterID Semester id for actual semester check
 * @param renderItem Function to render a list item.
 * @param task Task of submission
 * More information about render props: https://hu.reactjs.org/docs/render-props.html
 * @param handleCodeCompass Function to call when the code compass icon gets pressed
 * @constructor
 */
export function SubmissionsList({
    files,
    semesterID,
    handleStartCodeCompass,
    handleStopCodeCompass,
    renderItem,
    task,
}: Props) {
    const [gradedSubmission, setGradedSubmission] = useState<Submission | null>(null);
    const [ipLogSubmission, setIpLogSubmission] = useState<Submission | null>(null);
    const actualSemester = useActualSemester();
    const gradeMutation = useGradeMutation();
    const downloadfile = useDownloadSubmission();
    const downloadTestReport = useDownloadTestReport();
    const { t } = useTranslation();
    const notifications = useNotifications();
    const privateSystemInfo = usePrivateSystemInfoQuery();
    const isCodeCompassEnabled = privateSystemInfo.data?.isCodeCompassEnabled ?? false;
    const history = useHistory();

    const handleCodeView = async (file: Submission) => {
        if (file.name !== undefined) {
            history.push(`/instructor/task-manager/code-viewer/${file.id}`);
        }
    };

    // Download file
    const handleDownload = async (file: Submission) => {
        if (file.name !== undefined) {
            downloadfile.download(file.name, file.id);
        }
    };

    // Download test report
    const handleReportDownload = async (file: Submission) => {
        downloadTestReport.download(`${file.id}_report.tar`, file.id);
    };

    // Set graded file
    const handleGradeStart = (submission: Submission) => {
        setGradedSubmission(submission);
    };

    // Close grade modal and clear gradedSubmission value
    const handleGradeFinish = () => {
        setGradedSubmission(null);
    };

    // GraderModel save function
    const handleGradeSave = async (data: Submission) => {
        try {
            await gradeMutation.mutateAsync(data);
            handleGradeFinish();
            notifications.push({
                variant: 'success',
                message: t('task.successfulGrade'),
            });
        } catch (e) {
            // Already handled globally
        }
    };

    // Set submission for IP log
    const handleIpLogStart = (submission: Submission) => {
        setIpLogSubmission(submission);
    };

    // Close IP log modal and clear ipLogSubmission value
    const handleIpLogFinish = () => {
        setIpLogSubmission(null);
    };

    // Render
    return (
        <>
            {
                files.map((file) => (
                    <SubmissionListItem
                        key={file.id}
                        renderItem={renderItem}
                        isActualSemester={actualSemester.check(semesterID)}
                        isCodeCompassEnabled={isCodeCompassEnabled}
                        file={file}
                        onCodeView={handleCodeView}
                        onDownload={handleDownload}
                        onStartCodeCompass={handleStartCodeCompass}
                        onStopCodeCompass={handleStopCodeCompass}
                        onReportDownload={handleReportDownload}
                        onGrade={handleGradeStart}
                        onIpLog={handleIpLogStart}
                        task={task != null ? task : file.task}
                    />
                ))
            }

            <GraderModal
                file={gradedSubmission}
                show={gradedSubmission !== null}
                onSave={handleGradeSave}
                onCancel={handleGradeFinish}
                isLoading={gradeMutation.isLoading}
            />

            <IpLogModal
                submission={ipLogSubmission}
                task={task}
                show={ipLogSubmission !== null}
                onClose={handleIpLogFinish}
            />
        </>
    );
}
