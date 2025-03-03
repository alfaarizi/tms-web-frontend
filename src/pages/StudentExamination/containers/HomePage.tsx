import React from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

import { useTestInstances } from 'hooks/student/QuizTestInstanceHooks';
import { AvailableTestListItem } from 'pages/StudentExamination/components/AvailableTestListItem';
import { FinishedTestListItem } from 'pages/StudentExamination/components/FinishedTestListItem';
import { TestList } from 'pages/StudentExamination/components/TestList';
import { useSelectedSemester } from 'hooks/common/SemesterHooks';
import { FutureTestListItem } from '../components/FutureTestListItem';

export function HomePage() {
    const { selectedSemesterID } = useSelectedSemester();
    const history = useHistory();
    const { t } = useTranslation();
    const semesterID = selectedSemesterID;
    const availableTests = useTestInstances(semesterID, false, false);
    const finishedTests = useTestInstances(semesterID, true, false);
    const futureTests = useTestInstances(semesterID, false, true);

    const handleClick = (id: number) => {
        history.push(`/student/quizzes/test-instances/${id}`);
    };

    return (
        <>
            <TestList
                title={t('quizTests.availableTests')}
                testInstances={availableTests.data}
                renderItem={(testInstance) => (
                    <AvailableTestListItem
                        testInstance={testInstance}
                        onClick={() => handleClick(testInstance.id)}
                    />
                )}
            />
            <TestList
                title={t('quizTests.futureTests')}
                testInstances={futureTests.data}
                renderItem={(testInstance) => (
                    <FutureTestListItem
                        testInstance={testInstance}
                    />
                )}
            />
            <TestList
                title={t('quizTests.finishedTests')}
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
