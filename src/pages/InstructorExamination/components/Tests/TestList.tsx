import React from 'react';
import { useTranslation } from 'react-i18next';

import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { ListCardItem } from 'components/ListCardItem/ListCardItem';
import { DataRow } from 'components/DataRow';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { ExamTest } from 'resources/instructor/ExamTest';

type Props = {
    tests: ExamTest[] | undefined,
    onChange: (id: number) => void
}

export function TestList({
    tests,
    onChange,
}: Props) {
    const { t } = useTranslation();
    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('examTests.tests')}</CustomCardTitle>
            </CustomCardHeader>

            {tests?.map((test) => (
                <ListCardItem key={test.id} onClick={() => onChange(test.id)}>
                    <DataRow label={t('common.name')}>{test.name}</DataRow>
                    <DataRow label={t('course.course')}>
                        {test.courseName}
                        {' '}
                        (
                        {test.groupNumber}
                        )
                    </DataRow>
                    <DataRow label={t('examTests.available')}>
                        {test.availablefrom}
                        {' '}
                        -
                        {' '}
                        {test.availableuntil}
                    </DataRow>
                    <DataRow label={t('examTests.duration')}>{test.duration}</DataRow>
                    <DataRow label={t('examTests.questionAmount')}>{test.questionamount}</DataRow>
                </ListCardItem>
            ))}
        </CustomCard>
    );
}
