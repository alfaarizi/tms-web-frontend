import { QuizTest } from '@/resources/instructor/QuizTest';
import { useQuestionsForTest } from '@/hooks/instructor/QuizQuestionHooks';
import { QuestionList } from '@/pages/InstructorExamination/components/QuestionList/QuestionsList';

type Props = {
    test: QuizTest
}

export function TestQuestionsTab({ test }: Props) {
    const questions = useQuestionsForTest(true, test.id);

    if (!questions.data) {
        return null;
    }

    return <QuestionList questions={questions.data} />;
}
