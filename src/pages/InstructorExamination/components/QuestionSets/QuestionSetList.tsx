import { useTranslation } from 'react-i18next';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { ListCardItem } from '@/components/ListCardItem/ListCardItem';
import { DataRow } from '@/components/DataRow';
import { QuizQuestionSet } from '@/resources/instructor/QuizQuestionSet';

type Props = {
    sets: QuizQuestionSet[] | undefined,
    onNew: () => void,
    onChange: (id: number) => void
};

export function QuestionSetList({
    sets,
    onNew,
    onChange,
}: Props) {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('quizQuestions.questionSets')}</CustomCardTitle>
                <ToolbarButton icon={faPlus} text={t('common.add')} onClick={onNew} />
            </CustomCardHeader>

            {
                sets?.map((set) => (
                    <ListCardItem key={set.id} onClick={() => onChange(set.id)}>
                        <DataRow label={t('common.name')}>{set.name}</DataRow>
                        <DataRow label={t('course.course')}>{set.course.name}</DataRow>
                    </ListCardItem>
                ))
            }
        </CustomCard>
    );
}
