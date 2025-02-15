import { QuizTest } from '@/resources/instructor/QuizTest';
import { useQuizTestInstances } from '@/hooks/instructor/QuizTestInstaceHooks';
import { TestInstanceResultsList } from '@/pages/InstructorExamination/components/Tests/TestInstanceResultsList';

type Props = {
    test: QuizTest
}

export function TestResultsTab({ test }: Props) {
    const instances = useQuizTestInstances(test.id, true);

    if (!instances.data) {
        return null;
    }

    return <TestInstanceResultsList testInstances={instances.data} />;
}
