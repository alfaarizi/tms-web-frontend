import React from 'react';
import { useTranslation } from 'react-i18next';

import { ExamTestInstance } from 'resources/student/ExamTestInstance';
import { ListCardItem } from 'components/ListCardItem/ListCardItem';
import { DataRow } from 'components/DataRow';

type Props = {
    testInstance: ExamTestInstance
}

export function FutureTestListItem({
    testInstance,
}: Props) {
    const { t } = useTranslation();
    return (
        <ListCardItem>
            <DataRow label={t('course.course')}>{testInstance.test.courseName}</DataRow>
            <DataRow label={t('examTests.testName')}>{testInstance.test.name}</DataRow>
            <DataRow label={t('examTests.availablefrom')}>{testInstance.test.availablefrom}</DataRow>
        </ListCardItem>
    );
}
