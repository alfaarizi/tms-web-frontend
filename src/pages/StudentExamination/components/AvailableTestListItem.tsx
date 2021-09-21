import React from 'react';
import { useTranslation } from 'react-i18next';

import { ExamTestInstance } from 'resources/student/ExamTestInstance';
import { ListCardItem } from 'components/ListCardItem/ListCardItem';
import { DataRow } from 'components/DataRow';

type Props = {
    testInstance: ExamTestInstance,
    onClick: () => void
}

export function AvailableTestListItem({
    onClick,
    testInstance,
}: Props) {
    const { t } = useTranslation();
    return (
        <ListCardItem onClick={onClick}>
            <DataRow label={t('course.course')}>{testInstance.test.courseName}</DataRow>
            <DataRow label={t('examTests.testName')}>{testInstance.test.name}</DataRow>
            <DataRow label={t('examTests.availableuntil')}>{testInstance.test.availableuntil}</DataRow>
            <DataRow label={t('examTests.duration')}>
                {testInstance.test.duration}
                {' '}
                {t('common.minutes')}
            </DataRow>
        </ListCardItem>
    );
}
