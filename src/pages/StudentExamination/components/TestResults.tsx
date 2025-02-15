import { TestResultQuestion } from '@/pages/StudentExamination/components/TestResultQuestion';
import { QuizResultQuestion } from '@/resources/student/QuizResultQuestion';

type Props = {
    results?: QuizResultQuestion[];
}

export function TestResult({ results }: Props) {
    return (
        <>
            {
                results?.map((question) => <TestResultQuestion key={question.questionID} question={question} />)
            }
        </>
    );
}
