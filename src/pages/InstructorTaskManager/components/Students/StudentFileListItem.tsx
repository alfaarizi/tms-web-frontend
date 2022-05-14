import React, { ReactNode, useState } from 'react';
import { ButtonGroup, Col, Row } from 'react-bootstrap';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import {
    faCompass, faDownload, faEdit, faInfoCircle, faList, faStop,
} from '@fortawesome/free-solid-svg-icons';
import { ListCardItem } from 'components/ListCardItem/ListCardItem';
import { StudentFile } from 'resources/instructor/StudentFile';
import { useShow } from 'ui-hooks/useShow';
import { AutoTestResultAlert } from 'components/AutoTestResultAlert';
import { useTranslation } from 'react-i18next';
import { CodeCompassInformationAlert } from 'components/CodeCompassInformationAlert';
import { Status } from 'resources/instructor/CodeCompassInstance';

type Props = {
    renderItem: (file: StudentFile) => ReactNode,
    isActualSemester: boolean,
    isCodeCompassEnabled: boolean,
    file: StudentFile,
    onDownload: (file: StudentFile) => void,
    onStartCodeCompass: (file: StudentFile) => void,
    onStopCodeCompass: (file: StudentFile) => void,
    onGrade: (file: StudentFile) => void,
}

export function StudentFileListItem({
    file,
    isActualSemester,
    isCodeCompassEnabled,
    renderItem,
    onDownload,
    onStartCodeCompass,
    onStopCodeCompass,
    onGrade,
}: Props) {
    const { t } = useTranslation();
    const showAutoTesterResults = useShow();
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
                                    onClick={showAutoTesterResults.toShow}
                                    icon={faList}
                                    text={t('task.autoTester.results')}
                                    displayTextBreakpoint="none"
                                />
                            )
                            : null}

                        {isCodeCompassEnabled && !file.codeCompass
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

                        <ToolbarButton
                            onClick={() => onDownload(file)}
                            icon={faDownload}
                            text={t('common.download')}
                            displayTextBreakpoint="none"
                        />

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
                    </ButtonGroup>
                </Col>
            </Row>
            {showAutoTesterResults.show
                ? (
                    <AutoTestResultAlert
                        isAccepted={file.isAccepted}
                        errorMsg={file.errorMsg}
                        onClose={showAutoTesterResults.toHide}
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
