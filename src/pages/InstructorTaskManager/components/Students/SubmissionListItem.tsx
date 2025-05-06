import { ReactNode, useState } from 'react';
import { ButtonGroup, Col, Row } from 'react-bootstrap';
import {
    faCode,
    faCompass, faDownload, faEdit, faInfoCircle, faList, faStop, faHistory,
} from '@fortawesome/free-solid-svg-icons';
import { useShow } from '@/ui-hooks/useShow';
import { useTranslation } from 'react-i18next';
import { useAutoTestResults } from '@/hooks/instructor/SubmissionHooks';
import { AutoTestResultAlert } from '@/components/AutoTestResultAlert';
import { ListCardItem } from '@/components/ListCardItem/ListCardItem';
import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { CodeCompassInformationAlert } from '@/components/CodeCompassInformationAlert';
import { Status } from '@/resources/instructor/CodeCompassInstance';
import { Submission } from '@/resources/instructor/Submission';
import { Task } from '@/resources/instructor/Task';
import { WebAppExecutionControl } from '@/pages/InstructorTaskManager/containers/Submissions/WebAppExecutionControl';

type Props = {
    renderItem: (file: Submission) => ReactNode,
    isActualSemester: boolean,
    isAutoTesterButtonEnabled?: boolean,
    isCodeCompassEnabled: boolean,
    file: Submission,
    onCodeView: (file: Submission) => void,
    onDownload: (file: Submission) => void,
    onReportDownload: (file: Submission) => void
    onStartCodeCompass: (file: Submission) => void,
    onStopCodeCompass: (file: Submission) => void,
    onGrade: (file: Submission) => void,
    onIpLog: (file: Submission) => void,
    task?: Task,
}

export function SubmissionListItem({
    file,
    isActualSemester,
    isAutoTesterButtonEnabled = true,
    isCodeCompassEnabled,
    renderItem,
    task,
    onCodeView,
    onDownload,
    onReportDownload,
    onStartCodeCompass,
    onStopCodeCompass,
    onGrade,
    onIpLog,
}: Props) {
    const { t } = useTranslation();
    const showAutoTesterResults = useShow();
    const [loadAutoTesterResults, setLoadAutoTesterResults] = useState(false);
    const {
        data: autoTesterResults,
        refetch: refetchAutoTesterResults,
    } = useAutoTestResults(file.id, loadAutoTesterResults);
    const isExecutable = task && task.testOS !== null && task.appType === 'Web';
    const showCodeCompassInformation = useShow();
    const [isCodeCompassLoading, setIsCodeCompassLoading] = useState(false);

    const handleStartCodeCompass = async (data: Submission) => {
        setIsCodeCompassLoading(true);
        await onStartCodeCompass(data);
        setIsCodeCompassLoading(false);
    };

    const handleStopCodeCompass = async (data: Submission) => {
        setIsCodeCompassLoading(true);
        await onStopCodeCompass(data);
        setIsCodeCompassLoading(false);
    };

    const handleAutoTesterResultsDisplay = async () => {
        await refetchAutoTesterResults();
        setLoadAutoTesterResults(true); // keep the query enabled to get updates
        showAutoTesterResults.toShow();
    };

    return (
        <ListCardItem>
            <Row>
                <Col md={10}>
                    {renderItem(file)}
                </Col>
                <Col md={2} className="d-flex align-items-start justify-content-end">
                    <ButtonGroup>
                        {isAutoTesterButtonEnabled && (file.errorMsg || autoTesterResults)
                            ? (
                                <ToolbarButton
                                    onClick={handleAutoTesterResultsDisplay}
                                    icon={faList}
                                    text={t('task.evaluator.results')}
                                    displayTextBreakpoint="none"
                                />
                            )
                            : null }

                        {isCodeCompassEnabled && !file.codeCompass && file.uploadCount > 0
                            ? (
                                <ToolbarButton
                                    onClick={() => handleStartCodeCompass(file)}
                                    icon={faCompass}
                                    isLoading={isCodeCompassLoading}
                                    text={t('codeCompass.start')}
                                    displayTextBreakpoint="none"
                                />
                            )
                            : null}

                        {isCodeCompassEnabled && file.codeCompass?.status === Status.running
                            ? (
                                <ToolbarButton
                                    onClick={() => handleStopCodeCompass(file)}
                                    icon={faStop}
                                    isLoading={isCodeCompassLoading}
                                    text={t('codeCompass.stop')}
                                    displayTextBreakpoint="none"
                                />
                            )
                            : null}

                        {isCodeCompassEnabled && file.codeCompass
                            ? (
                                <ToolbarButton
                                    onClick={showCodeCompassInformation.toShow}
                                    icon={faInfoCircle}
                                    text={t('codeCompass.information')}
                                    displayTextBreakpoint="none"
                                />
                            )
                            : null}

                        {file.uploadCount > 0
                            ? (
                                <ToolbarButton
                                    onClick={() => onDownload(file)}
                                    icon={faDownload}
                                    text={t('common.download')}
                                    displayTextBreakpoint="none"
                                />
                            )
                            : null}

                        {file.uploadCount > 0
                            ? (
                                <ToolbarButton
                                    onClick={() => onCodeView(file)}
                                    icon={faCode}
                                    text={t('task.viewCode')}
                                    displayTextBreakpoint="none"
                                />
                            )
                            : null}

                        {file.uploadCount > 0
                            ? (
                                <ToolbarButton
                                    onClick={() => onIpLog(file)}
                                    icon={faHistory}
                                    text={t('task.ipLog.title')}
                                    displayTextBreakpoint="none"
                                />
                            )
                            : null}

                        {isActualSemester
                            ? (
                                <ToolbarButton
                                    onClick={() => onGrade(file)}
                                    icon={faEdit}
                                    text={t('task.grade')}
                                    displayTextBreakpoint="none"
                                />
                            )
                            : null}
                        {isExecutable && file.uploadCount > 0
                            && (
                                <WebAppExecutionControl
                                    file={file}
                                />
                            )}
                    </ButtonGroup>
                </Col>
            </Row>
            {isAutoTesterButtonEnabled && showAutoTesterResults.show
                ? (
                    <AutoTestResultAlert
                        status={file.status}
                        errorMsg={file.errorMsg}
                        results={autoTesterResults}
                        onClose={showAutoTesterResults.toHide}
                        appType={task?.appType || 'Console'}
                        onReportDownload={() => onReportDownload(file)}
                    />
                )
                : null}

            {file.codeCompass && showCodeCompassInformation.show
                ? (
                    <CodeCompassInformationAlert
                        codeCompassInstance={file.codeCompass}
                        onClose={showCodeCompassInformation.toHide}
                    />
                )
                : null}
        </ListCardItem>
    );
}
