import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';

import { TestForm } from 'pages/InstructorExamination/components/Tests/TestForm';
import { useQuestionSet } from 'hooks/instructor/ExamQuestionSetHooks';
import { ExamTest } from 'resources/instructor/ExamTest';
import { useCreateTestMutation } from 'hooks/instructor/ExamTestHooks';
import { useActualSemester } from 'hooks/common/SemesterHooks';
import { useGroupsForCourse } from 'hooks/instructor/GroupHooks';
import { ServerSideValidationError, ValidationErrorBody } from 'exceptions/ServerSideValidationError';

type Params = {
    questionsetID: string
}

export function NewTestPage() {
    const { t } = useTranslation();
    const history = useHistory();
    const params = useParams<Params>();
    const questionsetID = parseInt(params.questionsetID || '-1', 10);

    const questionSet = useQuestionSet(questionsetID);
    const actualSemester = useActualSemester();
    const groups = useGroupsForCourse(
        actualSemester.actualSemesterID || -1,
        questionSet.data?.course.id || -1,
        !!actualSemester.actualSemesterID && !!questionSet.data,
    );
    const createMutation = useCreateTestMutation();
    const [addErrorBody, setAddErrorBody] = useState<ValidationErrorBody | null>(null);

    if (!questionSet.data) {
        return null;
    }

    const handleSave = async (data: ExamTest) => {
        try {
            const responseData = await createMutation.mutateAsync({
                ...data,
                questionsetID,
            });
            history.replace(`/instructor/exam/tests/${responseData.id}`);
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setAddErrorBody(e.body);
            }
        }
    };

    const handleSaveCancel = () => {
        history.push(`/instructor/exam/question-sets/${questionsetID}`);
    };

    return (
        <TestForm
            title={t('examTests.newTest')}
            groups={groups.data}
            onSave={handleSave}
            onCancel={handleSaveCancel}
            serverSideError={addErrorBody}
        />
    );
}
