import { QuizTest } from 'resources/instructor/QuizTest';
import { useQuestionsForTest } from 'hooks/instructor/QuizQuestionHooks';
import { QuestionList } from 'pages/InstructorExamination/components/QuestionList/QuestionsList';
import { useGroupStudents } from 'hooks/instructor/GroupHooks';
import React, { useEffect, useState } from 'react';
import { UserSwitcher } from 'components/UserSwticher';

type Props = {
    test: QuizTest
}

export function UniqueTestQuestionsTab({ test }: Props) {
    const students = useGroupStudents(test.groupID);
    const [studentID, setStudentID] = useState(-1);
    const questions = useQuestionsForTest(studentID > -1, test.id, studentID);

    useEffect(() => {
        if (students.data && students.data.length > 0) {
            setStudentID(students.data[0].id);
        }
    }, [students.data]);

    if (!questions.data || !students.data) {
        return null;
    }

    return (
        <>
            <UserSwitcher users={students.data} onChange={setStudentID} selectedID={studentID} />
            <QuestionList questions={questions.data} />
        </>
    );
}
