import React, {
    useMemo, useState,
} from 'react';
import { ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import DropdownItem from 'react-bootstrap/DropdownItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileArchive, faFileCsv, faFileExcel, faFileExport, faFilterCircleXmark, faListUl, faSort,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import { Task } from 'resources/instructor/Task';
import { useDownloadAll, useExportSpreadsheet, useSubmissionsForTask } from 'hooks/instructor/SubmissionHooks';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { DataRow } from 'components/DataRow';
import { SubmissionsList } from 'pages/InstructorTaskManager/containers/Submissions/SubmissionsList';
import { ToolbarDropdown } from 'components/Buttons/ToolbarDropdown';
import { SpreadsheetFormat } from 'api/instructor/SubmissionsService';
import { GroupDateTime } from 'pages/InstructorTaskManager/components/Groups/GroupDateTime';
import { MultiLineTextBlock } from 'components/MutliLineTextBlock/MultiLineTextBlock';
import { Submission } from 'resources/instructor/Submission';
import { usePrivateSystemInfoQuery } from 'hooks/common/SystemHooks';
import { TaskLevelRepoDetails } from 'pages/InstructorTaskManager/components/Tasks/TaskLevelRepoDetails';
import { safeLocaleCompare } from 'utils/safeLocaleCompare';

type Props = {
    task: Task
    handleStartCodeCompass: (file: Submission) => void,
    handleStopCodeCompass: (file: Submission) => void,
}

enum SortType {
    ByUngradedFirst,
    ByName,
    ByUploadTime,
}

export function SubmissionsListTab({
    task, handleStartCodeCompass, handleStopCodeCompass,
}: Props) {
    const { t } = useTranslation();
    const privateSystemInfo = usePrivateSystemInfoQuery();
    const submissions = useSubmissionsForTask(task.id);
    const exportSpreadsheet = useExportSpreadsheet();
    const downloadAll = useDownloadAll();
    const [sortedBy, setSortedBy] = useState<SortType>(SortType.ByUngradedFirst);

    const handleExportSpreadsheet = (format: SpreadsheetFormat) => {
        exportSpreadsheet.download(`${task.name}.${format}`, { taskID: task.id, format });
    };

    const handleDownloadAll = (onlyUngraded: boolean) => {
        downloadAll.download(`${task.name}.zip`, { taskID: task.id, onlyUngraded });
    };

    const handleSorting = (sortingBy : SortType) => {
        setSortedBy(sortingBy);
    };

    const sortingByUngradedFirst = () => {
        if (!submissions.data) {
            return null;
        }

        const getStatusNumber = (s : Submission) => {
            // Ungraded
            if (s.status !== 'No Submission' && !s.grade) {
                return 1;
            }
            // Unsubmitted
            if (s.status === 'No Submission') {
                return 2;
            }
            // Graded
            return 3;
        };

        return submissions.data.sort(
            (a, b) => getStatusNumber(a) - getStatusNumber(b) || safeLocaleCompare(a.uploadTime, b.uploadTime),
        );
    };

    const sortingByName = () => {
        if (!submissions.data) {
            return null;
        }

        return submissions.data.sort(
            (a: Submission, b: Submission) => safeLocaleCompare(a.uploader.name, b.uploader.name),
        );
    };

    const sortingByUploadTime = () => {
        if (!submissions.data) {
            return null;
        }

        return submissions.data.sort(
            (a: Submission, b: Submission) => safeLocaleCompare(a.uploadTime, b.uploadTime),
        );
    };

    const sortedSubmissions = useMemo(() => {
        switch (sortedBy) {
        case SortType.ByName:
            return sortingByName();
        case SortType.ByUploadTime:
            return sortingByUploadTime();
        case SortType.ByUngradedFirst:
        default:
            return sortingByUngradedFirst();
        }
    }, [sortedBy, submissions.data]);

    const ungradedSubmissionCount = useMemo(() => (
        sortedSubmissions?.filter((s) => s.grade == null).length || 0
    ), [sortedSubmissions]);

    if (!sortedSubmissions) {
        return null;
    }

    return (
        <>
            {privateSystemInfo.data?.isVersionControlEnabled && task.isVersionControlled
                ? <TaskLevelRepoDetails url={task.taskLevelGitRepo} />
                : null}

            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>
                        {`${t('task.solutions')} (${sortedSubmissions.length}`}
                        <span className="d-none d-md-inline">
                            {`, ${t('task.ungraded')}: ${ungradedSubmissionCount})`}
                        </span>
                        <span className="d-md-none">{`/${ungradedSubmissionCount})`}</span>
                    </CustomCardTitle>
                    {sortedSubmissions.length !== 0 ? (
                        <ButtonGroup>
                            <ToolbarDropdown text={t('common.export')} icon={faFileExport}>
                                <DropdownItem onSelect={() => handleExportSpreadsheet('xlsx')}>
                                    <FontAwesomeIcon icon={faFileExcel} />
                                    {' XLSX'}
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
                            <ToolbarDropdown text={t('task.sorting.sorting')} icon={faSort}>
                                <DropdownItem
                                    onSelect={() => handleSorting(SortType.ByUngradedFirst)}
                                    active={sortedBy === SortType.ByUngradedFirst}
                                >
                                    {t('task.sorting.byUngradedFirst')}
                                </DropdownItem>
                                <DropdownItem
                                    onSelect={() => handleSorting(SortType.ByName)}
                                    active={sortedBy === SortType.ByName}
                                >
                                    {t('task.sorting.byName')}
                                </DropdownItem>
                                <DropdownItem
                                    onSelect={() => handleSorting(SortType.ByUploadTime)}
                                    active={sortedBy === SortType.ByUploadTime}
                                >
                                    {t('task.sorting.byUploadTime')}
                                </DropdownItem>
                            </ToolbarDropdown>
                        </ButtonGroup>
                    ) : null}
                </CustomCardHeader>

                <SubmissionsList
                    semesterID={task.semesterID}
                    files={sortedSubmissions}
                    task={task}
                    renderItem={(file) => (
                        <>
                            <DataRow label={t('task.uploader')}>
                                {`${file.uploader.name} (${file.uploader.userCode})`}
                            </DataRow>
                            <DataRow label={t('task.uploadTime')}>
                                <GroupDateTime value={file.uploadTime} timezone={task.group?.timezone || ''} />
                            </DataRow>
                            <DataRow label={t('task.delay')}>
                                {file.delay}
                            </DataRow>
                            <DataRow label={t('task.status')}>{file.translatedStatus}</DataRow>
                            {file.codeCheckerResult ? (
                                <DataRow label={t('task.evaluator.staticCodeAnalysis')}>
                                    <Link to={`/instructor/task-manager/submissions/${file.id}`}>
                                        {file.codeCheckerResult?.translatedStatus}
                                    </Link>
                                </DataRow>
                            ) : null}
                            <DataRow label={t('passwordProtected.verified')}>
                                {file.verified ? t('common.yes') : t('common.no')}
                            </DataRow>
                            <DataRow label={t('task.uploadCount')}>{file.uploadCount}</DataRow>
                            <DataRow label={t('task.grade')}>{file.grade}</DataRow>
                            <DataRow label={t('task.graderName')}>{file.graderName}</DataRow>
                            <DataRow label={t('task.notes')}>
                                <MultiLineTextBlock text={file.notes} />
                            </DataRow>
                            <DataRow label={t('task.ipAddresses')}>
                                {file.ipAddresses.join(', ')}
                            </DataRow>
                            {file.gitRepo
                                ? (
                                    <DataRow label={t('task.git.gitRepo')}>
                                        {file.isVersionControlled ? (
                                            <kbd>
                                                git clone
                                                {' '}
                                                {file.gitRepo}
                                                {' '}
                                                {file.uploader.userCode}
                                            </kbd>
                                        ) : file.gitRepo}
                                    </DataRow>
                                )
                                : null}
                        </>
                    )}
                    handleStartCodeCompass={handleStartCodeCompass}
                    handleStopCodeCompass={handleStopCodeCompass}
                />
            </CustomCard>
        </>
    );
}
