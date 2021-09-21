import React from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

import { useTestInstances } from 'hooks/student/ExamTestInstanceHooks';
import { AvailableTestListItem } from 'pages/StudentExamination/components/AvailableTestListItem';
import { FinishedTestListItem } from 'pages/StudentExamination/components/FinishedTestListItem';
import { TestList } from 'pages/StudentExamination/components/TestList';
import { useSelectedSemester } from 'hooks/common/SemesterHooks';

export function HomePage() {
    const { selectedSemesterID } = useSelectedSemester();
    const history = useHistory();
    const { t } = useTranslation();
    const semesterID = selectedSemesterID;
    const availableTests = useTestInstances(semesterID, false);
    const finishedTests = useTestInstances(semesterID, true);

    const handleClick = (id: number) => {
        history.push(`/student/exam/test-instances/${id}`);
    };

    return (
        <>
            <TestList
                title={t('examTests.availableTests')}
                testInstances={availableTests.data}
                renderItem={(testInstance) => (
                    <AvailableTestListItem
                        testInstance={testInstance}
                        onClick={() => handleClick(testInstance.id)}
                    />
                )}
            />
            <TestList
                title={t('examTests.finishedTests')}
                testInstances={finishedTests.data}
                renderItem={(testInstance) => (
                    <FinishedTestListItem
                        testInstance={testInstance}
                        onClick={() => handleClick(testInstance.id)}
                    />
                )}
            />
        </>
    );
}
