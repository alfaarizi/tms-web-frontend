import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { faPenAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { DataRow } from 'components/DataRow';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { QuizTestInstance } from 'resources/student/QuizTestInstance';
import { LocaleDateTime } from 'components/LocaleDateTime';

type Props = {
    testInstance: QuizTestInstance
}

export function TestInstanceDetails({ testInstance }: Props) {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{testInstance.test.name}</CustomCardTitle>
                {!testInstance.submitted
                    ? (
                        <LinkContainer to={testInstance.isUnlocked
                            ? `/student/quizzes/test-instances/${testInstance.id}/writer`
                            : `/student/quizzes/test-instances/${testInstance.id}/unlock`}
                        >
                            <ToolbarButton text={t('quizTests.writeTest')} icon={faPenAlt} />
                        </LinkContainer>
                    )
                    : null}

            </CustomCardHeader>
            <DataRow label={t('course.course')}>{testInstance.test.group?.course.name}</DataRow>
            <DataRow label={t('quizTests.availableuntil')}>
                <LocaleDateTime value={testInstance.test.availableuntil} />
            </DataRow>
            <DataRow label={t('quizTests.duration')}>
                {testInstance.test.duration}
                {' '}
                {t('common.minutes')}
            </DataRow>
            <DataRow label={t('quizTests.score')}>
                {testInstance.score}
                {' '}
                /
                {' '}
                {testInstance.maxScore}
            </DataRow>
        </CustomCard>
    );
}
