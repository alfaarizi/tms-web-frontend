import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { useShow } from 'ui-hooks/useShow';
import { StudentFileListItem } from 'pages/InstructorTaskManager/components/Students/StudentFileListItem';
import { useDownloadStudentFile, useGradeMutation, useStudentFile } from 'hooks/instructor/StudentFileHooks';
import { StudentFile } from 'resources/instructor/StudentFile';
import { useActualSemester } from 'hooks/common/SemesterHooks';
import { GraderModal } from 'pages/InstructorTaskManager/components/GraderModal';
import { useNotifications } from 'hooks/common/useNotifications';
import { DataRow } from 'components/DataRow';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { MultiLineTextBlock } from 'components/MutliLineTextBlock/MultiLineTextBlock';

type Params = {
    id?: string
}

/**
 * Shows information about a student file.
 * @constructor
 */
export function StudentFilePage() {
    const { t } = useTranslation();
    const params = useParams<Params>();
    const id = parseInt(params.id ? params.id : '-1', 10);
    const studentFile = useStudentFile(id);
    const gradeMutation = useGradeMutation();
    const downloadfile = useDownloadStudentFile();
    const showGrader = useShow();
    const actualSemester = useActualSemester();
    const notifications = useNotifications();

    if (!studentFile.data) {
        return null;
    }

    // Download file
    const handleDownload = async (file: StudentFile) => {
        downloadfile.download(file.name, file.id);
    };

    // GraderModel save function
    const handleGradeSave = async (data: StudentFile) => {
        try {
            await gradeMutation.mutateAsync(data);
            showGrader.toHide();
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
            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>{t('task.solution')}</CustomCardTitle>
                </CustomCardHeader>
                <StudentFileListItem
                    renderItem={(item) => (
                        <>
                            <DataRow label={t('common.group')}>
                                <Link to={`/instructor/task-manager/groups/${item.groupID}`}>
                                    {`${item.task?.group?.course.name}`}
                                    {` (${t('group.number')}: ${item?.task?.group?.number})`}
                                </Link>
                            </DataRow>
                            <DataRow label={t('task.task')}>
                                <Link to={`/instructor/task-manager/tasks/${item.task?.id}`}>{item.task?.name}</Link>
                            </DataRow>
                            <DataRow label={t('task.uploader')}>
                                {`${item.uploader.name} (${item.uploader.neptun})`}
                            </DataRow>
                            <DataRow label={t('task.uploadTime')}>{item.uploadTime}</DataRow>
                            <DataRow label={t('task.status')}>{item.translatedIsAccepted}</DataRow>
                            <DataRow label={t('task.grade')}>{item.grade}</DataRow>
                            <DataRow label={t('task.graderName')}>{item.graderName}</DataRow>
                            <DataRow label={t('task.notes')}>
                                <MultiLineTextBlock text={item.notes} />
                            </DataRow>
                            {item.gitRepo ? <DataRow label={t('task.git.gitRepo')}>{item.gitRepo}</DataRow> : null}
                        </>
                    )}
                    isActualSemester={actualSemester.check(studentFile.data.task?.semesterID)}
                    file={studentFile.data}
                    onDownload={handleDownload}
                    onGrade={showGrader.toShow}
                />
            </CustomCard>

            <GraderModal
                file={studentFile.data}
                show={showGrader.show}
                onSave={handleGradeSave}
                onCancel={showGrader.toHide}
            />
        </>

    );
}
