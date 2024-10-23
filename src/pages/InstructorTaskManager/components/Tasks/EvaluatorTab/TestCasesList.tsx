import React from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonGroup } from 'react-bootstrap';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { TestCase } from 'resources/instructor/TestCase';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { TestCaseListItem } from 'pages/InstructorTaskManager/components/Tasks/EvaluatorTab/TestCaseListitem';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { Task } from 'resources/instructor/Task';
import { TestCaseHeaderDropdown } from 'pages/InstructorTaskManager/components/Tasks/TestCaseHeaderDropdown';
import { ExportSpreadsheetParams } from 'hooks/instructor/SubmissionHooks';

type Props = {
    task: Task,
    testCases?: TestCase[],
    onNew: () => void,
    onEdit: (testCase: TestCase) => void,
    onDelete: (testCase: TestCase) => void,
    onExportTestCases: (fileName: string, funcParams: ExportSpreadsheetParams) => void,
    isActualSemester: boolean
}

export function TestCaseList({
    task,
    testCases,
    onNew,
    onEdit,
    onDelete,
    onExportTestCases,
    isActualSemester,
}: Props) {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>
                    {t('task.evaluator.testCases')}
                </CustomCardTitle>
                {isActualSemester
                    ? (
                        <ButtonGroup>
                            <TestCaseHeaderDropdown task={task} onExportTestCases={onExportTestCases} />
                            <ToolbarButton icon={faPlus} text={t('common.add')} onClick={onNew} />
                        </ButtonGroup>
                    )
                    : null}
            </CustomCardHeader>
            {testCases?.map((testCase) => (
                <TestCaseListItem
                    key={testCase.id}
                    testCase={testCase}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isActualSemester={isActualSemester}
                />
            ))}
        </CustomCard>
    );
}
