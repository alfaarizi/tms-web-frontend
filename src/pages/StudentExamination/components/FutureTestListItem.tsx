import { useTranslation } from 'react-i18next';

import { QuizTestInstance } from '@/resources/student/QuizTestInstance';
import { ListCardItem } from '@/components/ListCardItem/ListCardItem';
import { DataRow } from '@/components/DataRow';

type Props = {
    testInstance: QuizTestInstance
}

export function FutureTestListItem({
    testInstance,
}: Props) {
    const { t } = useTranslation();
    return (
        <ListCardItem>
            <DataRow label={t('course.course')}>{testInstance.test.group?.course.name}</DataRow>
            <DataRow label={t('quizTests.testName')}>{testInstance.test.name}</DataRow>
            <DataRow label={t('quizTests.availablefrom')}>{testInstance.test.availablefrom}</DataRow>
        </ListCardItem>
    );
}
