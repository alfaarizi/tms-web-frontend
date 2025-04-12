import { useTranslation } from 'react-i18next';

import { QuizTestInstance } from '@/resources/student/QuizTestInstance';
import { ListCardItem } from '@/components/ListCardItem/ListCardItem';
import { DataRow } from '@/components/DataRow';
import { LocaleDateTime } from '@/components/LocaleDateTime';

type Props = {
    testInstance: QuizTestInstance,
    onClick: () => void
}

export function AvailableTestListItem({
    onClick,
    testInstance,
}: Props) {
    const { t } = useTranslation();
    return (
        <ListCardItem onClick={onClick}>
            <DataRow label={t('course.course')}>{testInstance.test.group?.course.name}</DataRow>
            <DataRow label={t('quizTests.testName')}>{testInstance.test.name}</DataRow>
            <DataRow label={t('quizTests.availableuntil')}>
                <LocaleDateTime value={testInstance.test.availableuntil} />
            </DataRow>
            <DataRow label={t('quizTests.duration')}>
                {testInstance.test.duration}
                {' '}
                {t('common.minutes')}
            </DataRow>
        </ListCardItem>
    );
}
