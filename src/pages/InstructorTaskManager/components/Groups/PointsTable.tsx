import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { calcStats } from '@/utils/calcStats';

type Props = {
    stats: {
        taskID: number,
        name: string,
        points: number[],
        user?: number
    }[],
    showUserColumn?: boolean
}

export function PointsTable({
    stats,
    showUserColumn = false,
}: Props) {
    const { t } = useTranslation();

    const tableRows = [];

    for (let i = 0; i < stats.length; ++i) {
        const curr = stats[i];
        const {
            min,
            max,
            avg,
        } = calcStats(curr.points);

        tableRows.push(
            <tr key={curr.taskID}>
                <td>{curr.name}</td>
                {showUserColumn && <td>{curr.user}</td>}
                <td>{min}</td>
                <td>{max}</td>
                <td>{avg}</td>
            </tr>,
        );
    }

    return (
        <Table responsive>
            <thead>
                <tr>
                    <th>{t('common.name')}</th>
                    {showUserColumn && <th>{t('group.stats.studentPoints')}</th>}
                    <th>{t('group.stats.min')}</th>
                    <th>{t('group.stats.max')}</th>
                    <th>{t('group.stats.avg')}</th>
                </tr>
            </thead>
            <tbody>
                {tableRows}
            </tbody>
        </Table>
    );
}
