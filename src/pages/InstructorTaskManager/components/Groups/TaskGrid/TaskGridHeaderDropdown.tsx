import { useTranslation } from 'react-i18next';
import {
    faFileArchive,
    faFileCsv,
    faFileExcel,
    faFileExport,
    faCalendarMinus,
    faCalendarCheck,
    faCalendarPlus,
    faCalendarTimes,
    faListUl,
    faFilterCircleXmark,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import DropdownItem from 'react-bootstrap/DropdownItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon';

import { SpreadsheetFormat } from '@/api/instructor/SubmissionsService';
import { DownloadAllParams, ExportSpreadsheetParams } from '@/hooks/instructor/SubmissionHooks';

import styles from '@/pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGrid.module.css';
import { GridTask } from '@/resources/instructor/GridTask';

type Props = {
    task: GridTask,
    onDownloadAll: (fileName: string, funcParams: DownloadAllParams) => void,
    onExportSpreadsheet: (fileName: string, funcParams: ExportSpreadsheetParams) => void,
};

/**
 * Contains options for the given task and shows the current deadline status
 * @param onDownloadAll
 * @param onExportSpreadsheet
 * @param task
 * @constructor
 */
export function TaskGridHeaderDropdown({ onDownloadAll, onExportSpreadsheet, task }: Props) {
    const { t } = useTranslation();

    const handleExportSpreadsheet = (format: SpreadsheetFormat) => {
        onExportSpreadsheet(`${task.name}.${format}`, { taskID: task.id, format });
    };

    const handleDownloadAll = (onlyUngraded: boolean) => {
        onDownloadAll(`${task.name}.zip`, { taskID: task.id, onlyUngraded });
    };

    const now: DateTime = DateTime.now();
    const available: DateTime | null = task.available ? DateTime.fromISO(task.available) : null;
    const softDeadline: DateTime | null = task.softDeadline ? DateTime.fromISO(task.softDeadline) : null;
    const hardDeadline: DateTime = DateTime.fromISO(task.hardDeadline);

    let deadlineVariant: string;
    let deadlineText: string;
    let deadlineIcon: IconDefinition;
    if (available !== null && available > now) {
        deadlineText = t('task.deadlineStatus.notAvailable');
        deadlineVariant = 'secondary';
        deadlineIcon = faCalendarMinus;
    } else if (softDeadline !== null && softDeadline >= now) {
        deadlineText = t('task.deadlineStatus.withinTheDeadline');
        deadlineVariant = 'success';
        deadlineIcon = faCalendarCheck;
    } else if (softDeadline !== null && softDeadline <= now && hardDeadline >= now) {
        deadlineText = t('task.deadlineStatus.softDeadlineExpired');
        deadlineVariant = 'warning';
        deadlineIcon = faCalendarPlus;
    } else if (softDeadline === null && hardDeadline > now) {
        deadlineText = t('task.deadlineStatus.withinTheDeadline');
        deadlineVariant = 'success';
        deadlineIcon = faCalendarCheck;
    } else {
        deadlineVariant = 'danger';
        deadlineText = t('task.deadlineStatus.hardDeadlineExpired');
        deadlineIcon = faCalendarTimes;
    }

    return (
        <DropdownButton
            className={styles.taskGridDropdown}
            variant={deadlineVariant}
            title={(
                <span title={`${t('common.options')} / ${deadlineText}`}>
                    <FontAwesomeIcon icon={deadlineIcon} />
                </span>
            )}
        >
            <Dropdown.Header>
                <FontAwesomeIcon icon={deadlineIcon} />
                {' '}
                {deadlineText}
            </Dropdown.Header>
            <Dropdown.Divider />

            <Dropdown.Header>
                <FontAwesomeIcon icon={faFileExport} />
                {' '}
                {t('common.export')}
            </Dropdown.Header>
            <DropdownItem onSelect={() => handleExportSpreadsheet('xlsx')}>
                <FontAwesomeIcon icon={faFileExcel} />
                {' XLSX'}
            </DropdownItem>
            <DropdownItem onSelect={() => handleExportSpreadsheet('csv')}>
                <FontAwesomeIcon icon={faFileCsv} />
                {' CSV'}
            </DropdownItem>

            <Dropdown.Divider />
            <Dropdown.Header>
                <FontAwesomeIcon icon={faFileArchive} />
                {' '}
                {t('task.downloadSolutions')}
            </Dropdown.Header>
            <DropdownItem onSelect={() => handleDownloadAll(false)}>
                <FontAwesomeIcon icon={faListUl} />
                {' '}
                {t('task.downloadAll')}
            </DropdownItem>
            <DropdownItem onSelect={() => handleDownloadAll(true)}>
                <FontAwesomeIcon icon={faFilterCircleXmark} />
                {' '}
                {t('task.downloadOnlyUngraded')}
            </DropdownItem>
        </DropdownButton>
    );
}
