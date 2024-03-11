import React from 'react';
import { useTranslation } from 'react-i18next';

import { ExamTestInstance } from 'resources/student/ExamTestInstance';
import { ListCardItem } from 'components/ListCardItem/ListCardItem';
import { DataRow } from 'components/DataRow';

type Props = {
    testInstance: ExamTestInstance,
    onClick: () => void
}

export function FinishedTestListItem({
    onClick,
    testInstance,
}: Props) {
    const { t } = useTranslation();
    return (
        <ListCardItem onClick={onClick}>
            <DataRow label={t('course.course')}>{testInstance.test.group?.course.name}</DataRow>
            <DataRow label={t('examTests.testName')}>{testInstance.test.name}</DataRow>
            <DataRow label={t('examTests.score')}>
                {testInstance.score}
                {' '}
                /
                {' '}
                {testInstance.maxScore}
            </DataRow>
        </ListCardItem>
    );
}
