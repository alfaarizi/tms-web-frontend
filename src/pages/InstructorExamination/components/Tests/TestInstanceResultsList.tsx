import React from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap';
import { ExamTestInstance } from 'resources/instructor/ExamTestInstance';
import { Time } from 'components/Time';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { CustomCard } from 'components/CustomCard/CustomCard';

type Props = {
    testInstances: ExamTestInstance[]
}

export function TestInstanceResultsList({ testInstances }: Props) {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <Table responsive>
                <thead>
                    <tr>
                        <th>{t('common.studentName')}</th>
                        <th>{t('examTests.score')}</th>
                        <th>{t('examTests.writeDuration')}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        testInstances.map((instance) => (
                            <tr key={instance.id}>
                                <td>{instance.user.name}</td>
                                <td>{instance.score}</td>
                                <td><Time seconds={instance.testDuration} /></td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </CustomCard>
    );
}
