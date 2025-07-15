import { useTranslation } from 'react-i18next';

import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { ListCardItem } from '@/components/ListCardItem/ListCardItem';
import { DataRow } from '@/components/DataRow';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { QuizTest } from '@/resources/instructor/QuizTest';
import { DateTimeInterval } from '@/pages/InstructorExamination/components/Tests/DateTimeInterval';
import { useQuestionSets } from '@/hooks/instructor/QuizQuestionSetHooks';

type Props = {
    tests: QuizTest[] | undefined,
    onChange: (id: number) => void
}

export function TestList({
    tests,
    onChange,
}: Props) {
    const { t } = useTranslation();
    const { data: questionSets } = useQuestionSets();
    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('quizTests.tests')}</CustomCardTitle>
            </CustomCardHeader>

            {tests?.map((test) => (
                <ListCardItem key={test.id} onClick={() => onChange(test.id)}>
                    <DataRow label={t('common.name')}>{test.name}</DataRow>
                    <DataRow label={t('course.course')}>
                        {test.group?.course.name}
                        {' '}
                        (
                        {test.group?.number}
                        )
                    </DataRow>
                    <DataRow label={t('quizQuestions.questionSet')}>
                        {questionSets?.find(((qSet) => qSet.id === test.questionsetID))?.name || ''}
                    </DataRow>
                    <DataRow label={t('quizTests.available')}>
                        <DateTimeInterval
                            from={test.availablefrom}
                            to={test.availableuntil}
                            timezone={test.timezone}
                        />
                    </DataRow>
                    <DataRow label={t('quizTests.duration')}>{test.duration}</DataRow>
                    <DataRow label={t('quizTests.questionAmount')}>{test.questionamount}</DataRow>
                </ListCardItem>
            ))}
        </CustomCard>
    );
}
