import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
    TaskGridHeaderDropdown,
} from '@/pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGridHeaderDropdown';
import { DownloadAllParams, ExportSpreadsheetParams } from '@/hooks/instructor/SubmissionHooks';
import { TaskNameCell } from '@/pages/InstructorTaskManager/components/Groups/TaskGrid/TaskNameCell';
import styles from '@/pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGrid.module.css';
import { GridTask } from '@/resources/instructor/GridTask';

import { useBranding } from '@/ui-hooks/useBranding';
import i18next from 'i18next';

type Props = {
    categorizedTasks: GridTask[][],
    taskList: GridTask[],
    onDownloadAll: (fileName: string, funcParams: DownloadAllParams) => void,
    onExportSpreadsheet: (fileName: string, funcParams: ExportSpreadsheetParams) => void,
}

/**
 * Renders the table header with categorized task names
 * @param categorizedTasks
 * @param onDownloadAll
 * @param onExportSpreadsheet
 * @param taskList
 * @constructor
 */
export function TaskGridTableHeader({
    categorizedTasks, onDownloadAll, onExportSpreadsheet, taskList,
}: Props) {
    const { t } = useTranslation();
    const ref = useRef<HTMLTableCellElement>(null);
    const [widthForLeft, setWidthForLeft] = useState<number>();

    const branding = useBranding();

    useEffect(() => {
        if (ref.current != null) {
            setWidthForLeft(ref.current.offsetWidth);
        }
    }, []);

    const headerCategories = categorizedTasks.map((category) => (
        <th
            key={category[0].translatedCategory}
            colSpan={category.length}
        >
            {category[0].translatedCategory}
        </th>
    ));

    const headerTasks = taskList.map((task) => (
        <TaskNameCell key={task.id}>
            <Link to={`/instructor/task-manager/tasks/${task.id}`}>{task.name}</Link>
        </TaskNameCell>
    ));

    const headerDropdowns = taskList.map((task) => (
        <th key={task.id}>
            <TaskGridHeaderDropdown
                task={task}
                onDownloadAll={onDownloadAll}
                onExportSpreadsheet={onExportSpreadsheet}
            />
        </th>
    ));

    return (
        <thead className="text-center">
            <tr>
                <th
                    className={[styles.stickyHead, styles.outlines].join(' ')}
                    id="students"
                    colSpan={2}
                    rowSpan={2}
                    style={{ backgroundColor: 'white' }}
                >
                    {t('common.students')}
                </th>
                {headerCategories}
            </tr>
            <tr>
                {headerDropdowns}
            </tr>
            <tr>
                <th
                    ref={ref}
                    style={{ backgroundColor: 'white' }}
                    className={[styles.stickyHead, styles.outlines].join(' ')}
                >
                    {t('common.name')}
                </th>
                <th
                    style={{ left: widthForLeft, backgroundColor: 'white' }}
                    className={[styles.stickyHead, styles.outlines].join(' ')}
                >
                    {t('common.userCode', { uniId: branding.universityIdentifierName[i18next.language] })}
                </th>
                {headerTasks}
            </tr>
        </thead>
    );
}
