import React, { ReactNode, useState } from 'react';
import { ButtonGroup, Col, Row } from 'react-bootstrap';
import {
    faCompass, faDownload, faEdit, faInfoCircle, faList, faStop,
} from '@fortawesome/free-solid-svg-icons';
import { useShow } from 'ui-hooks/useShow';
import { useTranslation } from 'react-i18next';
import { useAutoTestResults } from 'hooks/instructor/StudentFileHooks';
import { AutoTestResultAlert } from 'components/AutoTestResultAlert';
import { ListCardItem } from 'components/ListCardItem/ListCardItem';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { CodeCompassInformationAlert } from 'components/CodeCompassInformationAlert';
import { Status } from 'resources/instructor/CodeCompassInstance';
import { StudentFile } from 'resources/instructor/StudentFile';
import { Task } from 'resources/instructor/Task';
import { WebAppExecutionControl } from '../../containers/StudentFiles/WebAppExecutionControl';

type Props = {
    renderItem: (file: StudentFile) => ReactNode,
    isActualSemester: boolean,
    isCodeCompassEnabled: boolean,
    file: StudentFile,
    onDownload: (file: StudentFile) => void,
    onReportDownload: (file: StudentFile) => void
    onStartCodeCompass: (file: StudentFile) => void,
    onStopCodeCompass: (file: StudentFile) => void,
    onGrade: (file: StudentFile) => void,
    task?: Task,
}

export function StudentFileListItem({
    file,
    isActualSemester,
    isCodeCompassEnabled,
    renderItem,
    task,
    onDownload,
    onReportDownload,
    onStartCodeCompass,
    onStopCodeCompass,
    onGrade,
}: Props) {
    const { t } = useTranslation();
    const showAutoTesterResults = useShow();
    const [loadAutoTesterResults, setLoadAutoTesterResults] = useState(false);
    const {
        data: autoTesterResults,
        refetch: refetchAutoTesterResults,
    } = useAutoTestResults(file.id, loadAutoTesterResults);
    const isExecutable = task && task.appType === 'Web';
    const showCodeCompassInformation = useShow();
    const [isCodeCompassLoading, setIsCodeCompassLoading] = useState(false);

    const handleStartCodeCompass = async (data: StudentFile) => {
        setIsCodeCompassLoading(true);
        await onStartCodeCompass(data);
        setIsCodeCompassLoading(false);
    };

    const handleStopCodeCompass = async (data: StudentFile) => {
        setIsCodeCompassLoading(true);
        await onStopCodeCompass(data);
        setIsCodeCompassLoading(false);
    };

    const handleAutoTesterResultsDisplay = async (data: StudentFile) => {
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
                        {file.errorMsg
                            ? (
                                <ToolbarButton
                                    onClick={() => handleAutoTesterResultsDisplay(file)}
                                    icon={faList}
                                    text={t('task.evaluator.results')}
                                    displayTextBreakpoint="none"
                                />
                            )
                            : null}

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
            {showAutoTesterResults.show
                ? (
                    <AutoTestResultAlert
                        isAccepted={file.isAccepted}
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
