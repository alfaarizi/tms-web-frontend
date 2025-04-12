import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { MultiLineTextBlock } from '@/components/MutliLineTextBlock/MultiLineTextBlock';
import { useTranslation } from 'react-i18next';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { MarkdownRenderer } from '@/components/MarkdownRenderer/MarkdownRenderer';

interface TaskDescriptionTabProps {
    taskCategory: string,
    taskDescription: string,
}

export function TaskDescriptionTab({ taskCategory, taskDescription }: TaskDescriptionTabProps) {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>
                    {t('task.description')}
                </CustomCardTitle>
            </CustomCardHeader>
            {taskCategory === 'Canvas tasks'
                ? <MultiLineTextBlock text={taskDescription} />
                : <MarkdownRenderer source={taskDescription} />}
        </CustomCard>
    );
}
