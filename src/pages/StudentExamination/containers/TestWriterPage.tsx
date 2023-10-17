import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { Form } from 'react-bootstrap';
import { useFieldArray, useForm } from 'react-hook-form';

import { FormButtons } from 'components/Buttons/FormButtons';
import { MarkdownRenderer } from 'components/MarkdownRenderer/MarkdownRenderer';
import { ExamQuestionCard } from 'components/ExamQuestionCard';
import { ExamWriterData } from 'resources/student/ExamWriterData';
import { ExamWriterQuestion } from 'resources/student/ExamWriterQuestion';
import { ExamWriterAnswer } from 'resources/student/ExamWriterAnswer';
import { ExamTestInstanceAnswer } from 'resources/student/ExamTestInstanceAnswer';
import { useStartWriteMutation, useFinishWriteMutation } from 'hooks/student/ExamTestInstanceHooks';
import { TestWriterHeader } from 'pages/StudentExamination/components/TestWriterHeader';
import { FullScreenSpinner } from 'components/FullScreenSpinner/FullScreenSpinner';

type Params = {
    id?: string
}

interface ExamWriterQuestionForm {
    test: ExamWriterQuestion[];
}

export function TestWriterPage() {
    // Router hooks
    const { params } = useRouteMatch<Params>();
    const history = useHistory();
    const id = parseInt(params.id || '-1', 10);

    // React-Query hooks
    const startWriteMutation = useStartWriteMutation();
    const finishWriteMutation = useFinishWriteMutation(id);

    // State
    const [testName, setTestName] = useState('');
    const [duration, setDuration] = useState(0);
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const [intervalID, setIntervalID] = useState<any>(null);
    const [timeoutID, setTimeoutID] = useState<any>(null);

    // React-hook-form
    const {
        register: registerAnswer,
        control,
        handleSubmit,
    } = useForm<ExamWriterQuestionForm>();
    // React-hook-form, build writer form with a field array
    // Docs: https://react-hook-form.com/api/usefieldarray/
    const {
        fields: questions,
        append,
    } = useFieldArray({
        control,
        name: 'test',
    });

    // Update countdown
    const handleTimeChange = () => {
        setDuration((old) => old - 1);
    };

    // Saves results
    const handleTestSubmit = handleSubmit(async (data) => {
        try {
            const arr: ExamTestInstanceAnswer[] = data.test.map((p) => ({ answerID: p.selectedAnswerID }));
            await finishWriteMutation.mutateAsync(arr);
            history.replace(`/student/exam/test-instances/${id}`);
        } catch (e) {
            // Already handled globally
        }
    });

    // Init test writer
    const handleStartWrite = async () => {
        try {
            // Load data from the server
            const data: ExamWriterData = await startWriteMutation.mutateAsync(id);
            setTestName(data.testName);
            setDuration(data.duration);
            // Build field array
            data.questions.forEach((question: ExamWriterQuestion) => append({
                ...question,
                selectedAnswerID: null,
            }));
            // Init interval and timeout
            const interval = setInterval(handleTimeChange, 1000);
            const timeout = setTimeout(handleTestSubmit, 1000 * data.duration);
            setIntervalID(interval);
            setTimeoutID(timeout);
            // Set writer state
            setIsStarted(true);
        } catch (e) {
            // Already handled globally
        }
    };

    // Start test write after page load
    useEffect(() => {
        handleStartWrite();
    }, [id]);

    // Cleanup interval and timeout when the user leaves the test writer page
    useEffect(() => (() => {
        if (intervalID !== null && timeoutID !== null) {
            window.clearInterval(intervalID);
            window.clearTimeout(timeoutID);
        }
    }),
    [timeoutID, intervalID]);

    // Render
    if (!isStarted) {
        return <FullScreenSpinner />;
    }

    return (
        <>
            <TestWriterHeader testName={testName} duration={duration} />
            <Form onSubmit={handleTestSubmit}>
                {
                    questions.map((question: ExamWriterQuestion, index: number) => (
                        <ExamQuestionCard key={question.id} text={question.text}>
                            {
                                question.answers?.map((answer: ExamWriterAnswer) => (
                                    <Form.Check
                                        type="radio"
                                        key={answer.id}
                                        value={answer.id}
                                        label={<MarkdownRenderer source={answer.text} />}
                                        {...registerAnswer(`test.${index}.selectedAnswerID` as const)}
                                    />
                                ))
                            }
                        </ExamQuestionCard>
                    ))
                }
                <FormButtons isLoading={finishWriteMutation.isLoading} />
            </Form>
        </>
    );
}
