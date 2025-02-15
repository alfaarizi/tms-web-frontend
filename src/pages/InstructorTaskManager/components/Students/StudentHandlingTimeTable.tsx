import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { StudentStats } from '@/resources/instructor/StudentStats';

type Props = {
    data: StudentStats[]
}

function calcValue(hardDeadLine: string, submittingTime?: string, softDeadLine?: string): string {
    const submittingTimeDate = submittingTime ? DateTime.fromISO(submittingTime) : null;
    const softDeadLineDate = softDeadLine ? DateTime.fromISO(softDeadLine) : null;
    const hardDeadLineDate = DateTime.fromISO(hardDeadLine);

    if (submittingTimeDate === null) {
        if (DateTime.now() <= hardDeadLineDate) {
            return 'group.stats.due';
        }
        return 'group.stats.missed';
    }
    if (softDeadLineDate === null) {
        if (submittingTimeDate <= hardDeadLineDate) {
            return 'group.stats.intime';
        }
        return 'group.stats.delayed';
    }
    if (submittingTimeDate <= softDeadLineDate) {
        return 'group.stats.intime';
    }
    return 'group.stats.delayed';
}

export function StudentHandlingTimeTable({ data }: Props) {
    const { t } = useTranslation();

    const tableRows = [];

    for (let i = 0; i < data.length; ++i) {
        const curr = data[i];

        tableRows.push(
            <tr key={curr.taskID}>
                <td>{curr.name}</td>
                <td>{t(calcValue(curr.hardDeadLine, curr.submittingTime, curr.softDeadLine))}</td>
            </tr>,
        );
    }

    return (
        <Table responsive>
            <thead>
                <tr>
                    <th>{t('common.name')}</th>
                    <th>{t('group.stats.submitted')}</th>
                </tr>
            </thead>
            <tbody>
                {tableRows}
            </tbody>
        </Table>
    );
}
