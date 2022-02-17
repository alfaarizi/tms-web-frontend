import { useTranslation } from 'react-i18next';

import { TestCase } from 'resources/instructor/TestCase';
import { ListCardItem } from 'components/ListCardItem/ListCardItem';
import { DataRow } from 'components/DataRow';
import { ButtonGroup, Col, Row } from 'react-bootstrap';
import React from 'react';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { DeleteToolbarButton } from 'components/Buttons/DeleteToolbarButton';

type Props = {
    testCase: TestCase,
    onEdit: (testCase: TestCase) => void,
    onDelete: (testCase: TestCase) => void,
    isActualSemester: boolean
}

export function TestCaseListItem({
    testCase,
    onEdit,
    onDelete,
    isActualSemester,
}: Props) {
    const { t } = useTranslation();

    return (
        <ListCardItem>
            <Row>
                <Col md={9}>
                    <DataRow label={t('task.autoTester.arguments')}>{testCase.arguments}</DataRow>
                    <DataRow label={t('task.autoTester.input')}>{testCase.input}</DataRow>
                    <DataRow label={t('task.autoTester.output')}>{testCase.output}</DataRow>
                </Col>
                <Col md={3}>
                    {isActualSemester
                        ? (
                            <>
                                <ButtonGroup className="float-right">
                                    <ToolbarButton
                                        icon={faEdit}
                                        onClick={() => onEdit(testCase)}
                                        text={t('common.edit')}
                                        displayTextBreakpoint="none"
                                    />
                                    <DeleteToolbarButton
                                        displayTextBreakpoint="none"
                                        onDelete={() => onDelete(testCase)}
                                    />
                                </ButtonGroup>
                                <div className="clearfix" />
                            </>
                        )
                        : null}
                </Col>
            </Row>
        </ListCardItem>
    );
}
