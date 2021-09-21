import React, { ReactNode, Fragment } from 'react';

import { ExamTestInstance } from 'resources/student/ExamTestInstance';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { CustomCard } from 'components/CustomCard/CustomCard';

type Props = {
    title: string
    testInstances?: ExamTestInstance[],
    renderItem: (testInstance: ExamTestInstance) => ReactNode
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
