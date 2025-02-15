import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { useShow } from '@/ui-hooks/useShow';
import { SubmissionListItem } from '@/pages/InstructorTaskManager/components/Students/SubmissionListItem';
import {
    useDownloadSubmission,
    useGradeMutation,
    useDownloadTestReport,
    useStartCodeCompassMutation, useStopCodeCompassMutation,
    useSubmission,
} from '@/hooks/instructor/SubmissionHooks';
import { Submission } from '@/resources/instructor/Submission';
import { useActualSemester } from '@/hooks/common/SemesterHooks';
import { GraderModal } from '@/pages/InstructorTaskManager/components/Submissions/GraderModal';
import { IpLogModal } from '@/pages/InstructorTaskManager/containers/Submissions/IpLogModal';
import { useNotifications } from '@/hooks/common/useNotifications';
import { DataRow } from '@/components/DataRow';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { GroupDateTime } from '@/pages/InstructorTaskManager/components/Groups/GroupDateTime';
import { MultiLineTextBlock } from '@/components/MutliLineTextBlock/MultiLineTextBlock';
import { usePrivateSystemInfoQuery } from '@/hooks/common/SystemHooks';
import { TabbedInterface } from '@/components/TabbedInterface';
import { Tab } from 'react-bootstrap';
import { StaticCodeAnalysisTab } from '@/pages/InstructorTaskManager/components/Submissions/StaticCodeAnalysisTab';

type Params = {
    id?: string
}

/**
 * Shows information about a submission.
 * @constructor
 */
export function SubmissionPage() {
    const { t } = useTranslation();
    const params = useParams<Params>();
    const id = parseInt(params.id ? params.id : '-1', 10);
    const submission = useSubmission(id);
    const gradeMutation = useGradeMutation();
    const downloadSubmission = useDownloadSubmission();
    const downloadTestReport = useDownloadTestReport();
    const showGrader = useShow();
    const showIpLog = useShow();
    const actualSemester = useActualSemester();
    const notifications = useNotifications();
    const privateSystemInfo = usePrivateSystemInfoQuery();
    const isCodeCompassEnabled = privateSystemInfo.data?.isCodeCompassEnabled ?? false;
    const startCodeCompass = useStartCodeCompassMutation(submission.data?.taskID || -1);
    const stopCodeCompass = useStopCodeCompassMutation(submission.data?.taskID || -1);
    const history = useHistory();

    if (!submission.data) {
        return null;
    }

    const handleCodeView = async (file: Submission) => {
        if (file.name !== undefined) {
            history.push(`/instructor/task-manager/code-viewer/${file.id}`);
        }
    };

    // Download file
    const handleDownload = async (file: Submission) => {
        if (file.name !== undefined) {
            downloadSubmission.download(file.name, file.id);
        }
    };

    // Download test report
    const handleReportDownload = async (file: Submission) => {
        downloadTestReport.download(`${file.id}_report.tar`, file.id);
    };

    // GraderModel save function
    const handleGradeSave = async (data: Submission) => {
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

    const handleStartCodeCompass = async (file: Submission) => {
        try {
            const data: Submission = await startCodeCompass.mutateAsync(file);
            if (data.codeCompass?.port) {
                window.open(`http://${window.location.hostname}:${data.codeCompass.port}/#`, '_blank');
            }
        } catch (e) {
            // Already handled globally
        }
    };

    const handleStopCodeCompass = async (file: Submission) => {
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
                <SubmissionListItem
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
                                {`${item.uploader.name} (${item.uploader.userCode})`}
                            </DataRow>
                            <DataRow label={t('task.uploadTime')}>
                                <GroupDateTime value={item.uploadTime} timezone={item.task?.group?.timezone || ''} />
                            </DataRow>
                            <DataRow label={t('task.delay')}>
                                {item.delay}
                            </DataRow>
                            <DataRow label={t('task.status')}>{item.translatedStatus}</DataRow>
                            <DataRow label={t('passwordProtected.verified')}>
                                {item.verified ? t('common.yes') : t('common.no')}
                            </DataRow>
                            <DataRow label={t('task.uploadCount')}>{item.uploadCount}</DataRow>
                            <DataRow label={t('task.grade')}>{item.grade}</DataRow>
                            <DataRow label={t('task.graderName')}>{item.graderName}</DataRow>
                            <DataRow label={t('task.notes')}>
                                <MultiLineTextBlock text={item.notes} />
                            </DataRow>
                            <DataRow label={t('task.ipAddresses')}>{item.ipAddresses.join(', ')}</DataRow>
                            {item.gitRepo ? <DataRow label={t('task.git.gitRepo')}>{item.gitRepo}</DataRow> : null}
                        </>
                    )}
                    isActualSemester={actualSemester.check(submission.data.task?.semesterID)}
                    isCodeCompassEnabled={isCodeCompassEnabled}
                    file={submission.data}
                    onCodeView={handleCodeView}
                    onDownload={handleDownload}
                    onReportDownload={handleReportDownload}
                    onStartCodeCompass={handleStartCodeCompass}
                    onStopCodeCompass={handleStopCodeCompass}
                    onGrade={showGrader.toShow}
                    onIpLog={showIpLog.toShow}
                    task={submission.data.task}
                />
            </CustomCard>

            <TabbedInterface id="submission-evaluator" defaultActiveKey="static-code-analysis">
                {submission.data.codeCheckerResult && (
                    <Tab eventKey="static-code-analysis" title={t('task.evaluator.staticCodeAnalysis')}>
                        <StaticCodeAnalysisTab result={submission.data.codeCheckerResult} />
                    </Tab>
                )}
            </TabbedInterface>

            <GraderModal
                file={submission.data}
                show={showGrader.show}
                onSave={handleGradeSave}
                onCancel={showGrader.toHide}
                isLoading={gradeMutation.isLoading}
            />

            <IpLogModal
                submission={submission.data}
                task={submission.data.task}
                show={showIpLog.show}
                onClose={showIpLog.toHide}
            />
        </>

    );
}
