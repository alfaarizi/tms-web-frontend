import React from 'react';
import { useHistory, useRouteMatch } from 'react-router';

import { useQuestionSets } from 'hooks/instructor/QuizQuestionSetHooks';
import { useTests } from 'hooks/instructor/QuizTestHooks';
import { QuestionSetList } from 'pages/InstructorExamination/components/QuestionSets/QuestionSetList';
import { TestList } from 'pages/InstructorExamination/components/Tests/TestList';
import { useSelectedSemester } from 'hooks/common/SemesterHooks';

export function HomePage() {
    const { url } = useRouteMatch();
    const history = useHistory();

    const { selectedSemesterID } = useSelectedSemester();
    const sets = useQuestionSets();
    const tests = useTests(selectedSemesterID);

    const handleQuestionSetChange = (id: number) => {
        history.push(`${url}/question-sets/${id}`);
    };

    const handleNewClick = () => {
        history.push(`${url}/question-sets/new`);
    };

    const handleTestChange = (id: number) => {
        history.push(`${url}/tests/${id}`);
    };

    return (
        <>
            <QuestionSetList sets={sets.data} onChange={handleQuestionSetChange} onNew={handleNewClick} />
            <TestList tests={tests.data} onChange={handleTestChange} />
        </>
    );
}
