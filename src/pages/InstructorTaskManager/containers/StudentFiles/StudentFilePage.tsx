import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { useShow } from 'ui-hooks/useShow';
import { StudentFileListItem } from 'pages/InstructorTaskManager/components/Students/StudentFileListItem';
import {
    useDownloadStudentFile,
    useGradeMutation,
    useDownloadTestReport,
    useStartCodeCompassMutation, useStopCodeCompassMutation,
    useStudentFile,
} from 'hooks/instructor/StudentFileHooks';
import { StudentFile } from 'resources/instructor/StudentFile';
import { useActualSemester } from 'hooks/common/SemesterHooks';
import { GraderModal } from 'pages/InstructorTaskManager/components/StudentFiles/GraderModal';
import { useNotifications } from 'hooks/common/useNotifications';
import { DataRow } from 'components/DataRow';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { GroupDateTime } from 'pages/InstructorTaskManager/components/Groups/GroupDateTime';
import { MultiLineTextBlock } from 'components/MutliLineTextBlock/MultiLineTextBlock';
import { usePrivateSystemInfoQuery } from 'hooks/common/SystemHooks';
import { TabbedInterface } from 'components/TabbedInterface';
import { Tab } from 'react-bootstrap';
import { StaticCodeAnalysisTab } from 'pages/InstructorTaskManager/components/StudentFiles/StaticCodeAnalysisTab';

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
    const downloadStudentFile = useDownloadStudentFile();
    const downloadTestReport = useDownloadTestReport();
    const showGrader = useShow();
    const actualSemester = useActualSemester();
    const notifications = useNotifications();
    const privateSystemInfo = usePrivateSystemInfoQuery();
    const isCodeCompassEnabled = privateSystemInfo.data?.isCodeCompassEnabled ?? false;
    const startCodeCompass = useStartCodeCompassMutation(studentFile.data?.taskID || -1);
    const stopCodeCompass = useStopCodeCompassMutation(studentFile.data?.taskID || -1);
    const history = useHistory();

    if (!studentFile.data) {
        return null;
    }

    const handleCodeView = async (file: StudentFile) => {
        if (file.name !== undefined) {
            history.push(`/instructor/task-manager/code-viewer/${file.id}`);
        }
    };

    // Download file
    const handleDownload = async (file: StudentFile) => {
        if (file.name !== undefined) {
            downloadStudentFile.download(file.name, file.id);
        }
    };

    // Download test report
    const handleReportDownload = async (file: StudentFile) => {
        downloadTestReport.download(`${file.id}_report.tar`, file.id);
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

    const handleStartCodeCompass = async (file: StudentFile) => {
        try {
            const data: StudentFile = await startCodeCompass.mutateAsync(file);
            if (data.codeCompass?.port) {
                window.open(`http://${window.location.hostname}:${data.codeCompass.port}/#`, '_blank');
            }
        } catch (e) {
            // Already handled globally
        }
    };

    const handleStopCodeCompass = async (file: StudentFile) => {
        try {
            await stopCodeCompass.mutateAsync(file);
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
                                    {` (${t('group.number')}: ${item?.task?.group?.number || ''})`}
                                </Link>
                            </DataRow>
                            <DataRow label={t('task.task')}>
                                <Link to={`/instructor/task-manager/tasks/${item.task?.id}`}>{item.task?.name}</Link>
                            </DataRow>
                            <DataRow label={t('task.uploader')}>
                                {`${item.uploader.name} (${item.uploader.neptun})`}
                            </DataRow>
                            <DataRow label={t('task.uploadTime')}>
                                <GroupDateTime value={item.uploadTime} timezone={item.task?.group?.timezone || ''} />
                            </DataRow>
                            <DataRow label={t('task.delay')}>
                                {item.delay}
                            </DataRow>
                            <DataRow label={t('task.status')}>{item.translatedIsAccepted}</DataRow>
                            <DataRow label={t('passwordProtected.verified')}>
                                {item.verified ? t('common.yes') : t('common.no')}
                            </DataRow>
                            <DataRow label={t('task.uploadCount')}>{item.uploadCount}</DataRow>
                            <DataRow label={t('task.grade')}>{item.grade}</DataRow>
                            <DataRow label={t('task.graderName')}>{item.graderName}</DataRow>
                            <DataRow label={t('task.notes')}>
                                <MultiLineTextBlock text={item.notes} />
                            </DataRow>
                            {item.gitRepo ? <DataRow label={t('task.git.gitRepo')}>{item.gitRepo}</DataRow> : null}
                        </>
                    )}
                    isActualSemester={actualSemester.check(studentFile.data.task?.semesterID)}
                    isCodeCompassEnabled={isCodeCompassEnabled}
                    file={studentFile.data}
                    onCodeView={handleCodeView}
                    onDownload={handleDownload}
                    onReportDownload={handleReportDownload}
                    onStartCodeCompass={handleStartCodeCompass}
                    onStopCodeCompass={handleStopCodeCompass}
                    onGrade={showGrader.toShow}
                    task={studentFile.data.task}
                />
            </CustomCard>

            <TabbedInterface id="student-file-evaluator" defaultActiveKey="static-code-analysis">
                {studentFile.data.codeCheckerResult && (
                    <Tab eventKey="static-code-analysis" title={t('task.evaluator.staticCodeAnalysis')}>
                        <StaticCodeAnalysisTab result={studentFile.data.codeCheckerResult} />
                    </Tab>
                )}
            </TabbedInterface>

            <GraderModal
                file={studentFile.data}
                show={showGrader.show}
                onSave={handleGradeSave}
                onCancel={showGrader.toHide}
                isLoading={gradeMutation.isLoading}
            />
        </>

    );
}
