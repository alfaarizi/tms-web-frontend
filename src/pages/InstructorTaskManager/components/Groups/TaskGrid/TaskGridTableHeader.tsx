import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { TaskGridHeaderDropdown } from 'pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGridHeaderDropdown';
import { GridTask } from 'resources/instructor/GridTask.php';
import { DownloadAllParams, ExportSpreadsheetParams } from 'hooks/instructor/StudentFileHooks';
import { TaskNameCell } from 'pages/InstructorTaskManager/components/Groups/TaskGrid/TaskNameCell';

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
                <th className="align-middle" colSpan={2} rowSpan={2}>{t('common.students')}</th>
                {headerCategories}
            </tr>
            <tr>
                {headerDropdowns}
            </tr>
            <tr>
                <th>{t('common.name')}</th>
                <th>{t('common.neptun')}</th>
                {headerTasks}
            </tr>
        </thead>
    );
}
