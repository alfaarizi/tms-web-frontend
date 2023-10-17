import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StudentFile } from 'resources/instructor/StudentFile';
import { GraderModal } from 'pages/InstructorTaskManager/components/StudentFiles/GraderModal';
import { useActualSemester } from 'hooks/common/SemesterHooks';
import { useDownloadStudentFile, useGradeMutation } from 'hooks/instructor/StudentFileHooks';
import { StudentFileListItem } from 'pages/InstructorTaskManager/components/Students/StudentFileListItem';
import { useNotifications } from 'hooks/common/useNotifications';
import { Task } from 'resources/instructor/Task';
import { usePrivateSystemInfoQuery } from 'hooks/common/SystemHooks';

type Props = {
    files: StudentFile[],
    semesterID: number,
    handleStartCodeCompass: (f: StudentFile) => void
    handleStopCodeCompass: (f: StudentFile) => void
    renderItem: (f: StudentFile) => ReactNode
    task?: Task
}

/**
 * Reusable container component for rendering studentfile lists
 * @param files List of files
 * @param semesterID Semester id for actual semester check
 * @param renderItem Function to render a list item.
 * More information about render props: https://hu.reactjs.org/docs/render-props.html
 * @param handleCodeCompass Function to call when the code compass icon gets pressed
 * @constructor
 */
export function StudentFilesList({
    files,
    semesterID,
    handleStartCodeCompass,
    handleStopCodeCompass,
    renderItem,
    task,
}: Props) {
    const [gradedFile, setGradedFile] = useState<StudentFile | null>(null);
    const actualSemester = useActualSemester();
    const gradeMutation = useGradeMutation();
    const downloadfile = useDownloadStudentFile();
    const { t } = useTranslation();
    const notifications = useNotifications();
    const privateSystemInfo = usePrivateSystemInfoQuery();
    const isCodeCompassEnabled = privateSystemInfo.data?.isCodeCompassEnabled ?? false;

    // Download file
    const handleDownload = async (file: StudentFile) => {
        if (file.name !== undefined) {
            downloadfile.download(file.name, file.id);
        }
    };

    // Set graded file
    const handleGradeStart = (file: StudentFile) => {
        setGradedFile(file);
    };

    // Close grade modal and clear gradedFile value
    const handleGradeFinish = () => {
        setGradedFile(null);
    };

    // GraderModel save function
    const handleGradeSave = async (data: StudentFile) => {
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

    // Render
    return (
        <>
            {
                files.map((file) => (
                    <StudentFileListItem
                        key={file.id}
                        renderItem={renderItem}
                        isActualSemester={actualSemester.check(semesterID)}
                        isCodeCompassEnabled={isCodeCompassEnabled}
                        file={file}
                        onDownload={handleDownload}
                        onStartCodeCompass={handleStartCodeCompass}
                        onStopCodeCompass={handleStopCodeCompass}
                        onGrade={handleGradeStart}
                        task={task != null ? task : file.task}
                    />
                ))
            }

            <GraderModal
                file={gradedFile}
                show={gradedFile !== null}
                onSave={handleGradeSave}
                onCancel={handleGradeFinish}
                isLoading={gradeMutation.isLoading}
            />
        </>
    );
}
