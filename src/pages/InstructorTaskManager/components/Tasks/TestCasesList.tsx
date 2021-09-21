import React from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonGroup } from 'react-bootstrap';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { TestCase } from 'resources/instructor/TestCase';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { TestCaseListItem } from 'pages/InstructorTaskManager/components/Tasks/TestCaseListitem';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';

type Props = {
    testCases?: TestCase[],
    onNew: () => void,
    onEdit: (testCase: TestCase) => void,
    onDelete: (testCase: TestCase) => void,
    isActualSemester: boolean
}

export function TestCaseList({
    testCases,
    onNew,
    onEdit,
    onDelete,
    isActualSemester,
}: Props) {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>
                    {t('task.autoTester.testCases')}
                </CustomCardTitle>
                {isActualSemester
                    ? (
                        <ButtonGroup>
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
