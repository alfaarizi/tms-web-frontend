import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { faPenAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { DataRow } from 'components/DataRow';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { ExamTestInstance } from 'resources/student/ExamTestInstance';
import { LocaleDateTime } from 'components/LocaleDateTime';

type Props = {
    testInstance: ExamTestInstance
}

export function TestInstanceDetails({ testInstance }: Props) {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{testInstance.test.name}</CustomCardTitle>
                {!testInstance.submitted
                    ? (
                        <LinkContainer to={`/student/exam/test-instances/${testInstance.id}/writer`}>
                            <ToolbarButton text={t('examTests.writeTest')} icon={faPenAlt} />
                        </LinkContainer>
                    )
                    : null}

            </CustomCardHeader>
            <DataRow label={t('course.course')}>{testInstance.test.courseName}</DataRow>
            <DataRow label={t('examTests.availableuntil')}>
                <LocaleDateTime value={testInstance.test.availableuntil} />
            </DataRow>
            <DataRow label={t('examTests.duration')}>
                {testInstance.test.duration}
                {' '}
                {t('common.minutes')}
            </DataRow>
            <DataRow label={t('examTests.score')}>
                {testInstance.score}
                {' '}
                /
                {' '}
                {testInstance.maxScore}
            </DataRow>
        </CustomCard>
    );
}
