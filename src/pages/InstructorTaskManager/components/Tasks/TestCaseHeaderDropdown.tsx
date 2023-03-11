import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faFileCsv, faFileExcel, faFileExport } from '@fortawesome/free-solid-svg-icons';
import DropdownItem from 'react-bootstrap/DropdownItem';
import { useTranslation } from 'react-i18next';
import { SpreadsheetFormat } from 'api/instructor/StudentFilesService';
import { ExportSpreadsheetParams } from 'hooks/instructor/StudentFileHooks';
import { Task } from 'resources/instructor/Task';
import { ToolbarDropdown } from 'components/Buttons/ToolbarDropdown';

type Props = {
    task: Task,
    onExportTestCases: (fileName: string, funcParams: ExportSpreadsheetParams) => void,
};

export function TestCaseHeaderDropdown({ task, onExportTestCases } : Props) {
    const { t } = useTranslation();

    const handleExportSpreadsheet = (format: SpreadsheetFormat) => {
        onExportTestCases(`${task.name}.${format}`, { taskID: task.id, format });
    };
    return (
        <ToolbarDropdown
            text={t('common.export')}
            icon={faFileExport}
        >
            <DropdownItem onSelect={() => handleExportSpreadsheet('xlsx')}>
                <FontAwesomeIcon icon={faFileExcel} />
                {' XLSX'}
            </DropdownItem>
            <DropdownItem onSelect={() => handleExportSpreadsheet('csv')}>
                <FontAwesomeIcon icon={faFileCsv} />
                {' CSV'}
            </DropdownItem>
        </ToolbarDropdown>
    );
}
