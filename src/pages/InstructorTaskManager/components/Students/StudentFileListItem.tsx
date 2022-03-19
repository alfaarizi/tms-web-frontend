import React, { ReactNode } from 'react';
import { ButtonGroup, Col, Row } from 'react-bootstrap';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { faDownload, faEdit, faList } from '@fortawesome/free-solid-svg-icons';
import { ListCardItem } from 'components/ListCardItem/ListCardItem';
import { StudentFile } from 'resources/instructor/StudentFile';
import { useShow } from 'ui-hooks/useShow';
import { AutoTestResultAlert } from 'components/AutoTestResultAlert';
import { useTranslation } from 'react-i18next';

type Props = {
    renderItem: (file: StudentFile) => ReactNode,
    isActualSemester: boolean,
    file: StudentFile,
    onDownload: (file: StudentFile) => void,
    onGrade: (file: StudentFile) => void,
}

export function StudentFileListItem({
    file,
    isActualSemester,
    renderItem,
    onDownload,
    onGrade,
}: Props) {
    const { t } = useTranslation();
    const showAutoTesterResults = useShow();

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
        </ListCardItem>
    );
}
