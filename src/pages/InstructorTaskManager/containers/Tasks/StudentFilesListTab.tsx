import React, { useMemo } from 'react';
import { ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import DropdownItem from 'react-bootstrap/DropdownItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileArchive, faFileCsv, faFileExcel, faFileExport, faFilterCircleXmark, faListUl,
} from '@fortawesome/free-solid-svg-icons';

import { Task } from 'resources/instructor/Task';
import { useDownloadAll, useExportSpreadsheet, useStudentFilesForTask } from 'hooks/instructor/StudentFileHooks';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { DataRow } from 'components/DataRow';
import { StudentFilesList } from 'pages/InstructorTaskManager/containers/StudentFiles/StudentFilesList';
import { ToolbarDropdown } from 'components/Buttons/ToolbarDropdown';
import { SpreadsheetFormat } from 'api/instructor/StudentFilesService';
import { GroupDateTime } from 'pages/InstructorTaskManager/components/Groups/GroupDateTime';
import { MultiLineTextBlock } from 'components/MutliLineTextBlock/MultiLineTextBlock';
import { StudentFile } from 'resources/instructor/StudentFile';

type Props = {
    task: Task
}

export function StudentFilesListTab({ task }: Props) {
    const { t } = useTranslation();
    const studentFiles = useStudentFilesForTask(task.id);
    const exportSpreadsheet = useExportSpreadsheet();
    const downloadAll = useDownloadAll();

    const handleExportSpreadsheet = (format: SpreadsheetFormat) => {
        exportSpreadsheet.download(`${task.name}.${format}`, { taskID: task.id, format });
    };

    const handleDownloadAll = (onlyUngraded: boolean) => {
        downloadAll.download(`${task.name}.zip`, { taskID: task.id, onlyUngraded });
    };

    const sortedStudentFiles = useMemo(() => {
        if (!studentFiles.data) {
            return null;
        }

        return studentFiles.data.sort(
            (a: StudentFile, b: StudentFile) => {
                if (!a.grade && !!b.grade) {
                    return -1;
                }
                if (!!a.grade && !b.grade) {
                    return 1;
                }

                return a.uploadTime.localeCompare(b.uploadTime);
            },
        );
    }, [studentFiles.data]);

    if (!sortedStudentFiles) {
        return null;
    }

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('task.solutions')}</CustomCardTitle>
                {sortedStudentFiles.length !== 0 ? (
                    <ButtonGroup>
                        <ToolbarDropdown text={t('common.export')} icon={faFileExport}>
                            <DropdownItem onSelect={() => handleExportSpreadsheet('xls')}>
                                <FontAwesomeIcon icon={faFileExcel} />
                                {' XLS'}
                            </DropdownItem>
                            <DropdownItem onSelect={() => handleExportSpreadsheet('csv')}>
                                <FontAwesomeIcon icon={faFileCsv} />
                                {' CSV'}
                            </DropdownItem>
                        </ToolbarDropdown>
                        <ToolbarDropdown text={t('task.downloadSolutions')} icon={faFileArchive}>
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
                        </ToolbarDropdown>
                    </ButtonGroup>
                ) : null}
            </CustomCardHeader>

            <StudentFilesList
                semesterID={task.semesterID}
                files={sortedStudentFiles}
                renderItem={(file) => (
                    <>
                        <DataRow label={t('task.uploader')}>
                            {`${file.uploader.name} (${file.uploader.neptun})`}
                        </DataRow>
                        <DataRow label={t('task.uploadTime')}>
                            <GroupDateTime value={file.uploadTime} timezone={task.group?.timezone || ''} />
                        </DataRow>
                        <DataRow label={t('task.delay')}>
                            {file.delay}
                        </DataRow>
                        <DataRow label={t('task.status')}>{file.translatedIsAccepted}</DataRow>
                        <DataRow label={t('task.grade')}>{file.grade}</DataRow>
                        <DataRow label={t('task.graderName')}>{file.graderName}</DataRow>
                        <DataRow label={t('task.notes')}>
                            <MultiLineTextBlock text={file.notes} />
                        </DataRow>
                        {file.gitRepo ? <DataRow label={t('task.git.gitRepo')}>{file.gitRepo}</DataRow> : null}
                    </>
                )}
            />
        </CustomCard>
    );
}
