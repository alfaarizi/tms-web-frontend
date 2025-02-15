import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap';
import { QuizTestInstance } from '@/resources/instructor/QuizTestInstance';
import { Time } from '@/components/Time';
import { CustomCard } from '@/components/CustomCard/CustomCard';

type Props = {
    testInstances: QuizTestInstance[]
}

export function TestInstanceResultsList({ testInstances }: Props) {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <Table responsive>
                <thead>
                    <tr>
                        <th>{t('common.studentName')}</th>
                        <th>{t('quizTests.score')}</th>
                        <th>{t('quizTests.writeDuration')}</th>
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
