import { ReactNode, Fragment } from 'react';

import { QuizTestInstance } from '@/resources/student/QuizTestInstance';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { CustomCard } from '@/components/CustomCard/CustomCard';

type Props = {
    title: string
    testInstances?: QuizTestInstance[],
    renderItem: (testInstance: QuizTestInstance) => ReactNode
}

export function TestList({
    title,
    renderItem,
    testInstances,
}: Props) {
    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{title}</CustomCardTitle>
            </CustomCardHeader>

            {testInstances?.map((instance) => <Fragment key={instance.id}>{renderItem(instance)}</Fragment>)}
        </CustomCard>
    );
}
