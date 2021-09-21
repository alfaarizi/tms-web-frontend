import React from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { GroupStats } from 'resources/instructor/GroupStats';

type Props = {
    stats: GroupStats[]
}

export function GroupHandlingTimeTable({ stats }: Props) {
    const { t } = useTranslation();

    const tableRows = [];

    for (let i = 0; i < stats.length; ++i) {
        const curr = stats[i];

        tableRows.push(
            <tr key={curr.taskID}>
                <td>{curr.name}</td>
                <td>{curr.submitted.intime}</td>
                <td>{curr.submitted.delayed}</td>
                <td>{curr.submitted.missed}</td>
            </tr>,
        );
    }

    return (
        <Table responsive>
            <thead>
                <tr>
                    <th>{t('common.name')}</th>
                    <th>{t('group.stats.intime')}</th>
                    <th>{t('group.stats.delayed')}</th>
                    <th>{t('group.stats.missed')}</th>
                </tr>
            </thead>
            <tbody>
                {tableRows}
            </tbody>
        </Table>
    );
}
