import React from 'react';
import { useTranslation } from 'react-i18next';

import { Group } from 'resources/instructor/Group';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { StudentFilesList } from 'pages/InstructorTaskManager/containers/StudentFiles/StudentFilesList';
import { DataRow } from 'components/DataRow';
import { useStudentFilesForStudent } from 'hooks/instructor/StudentFileHooks';
import { User } from 'resources/common/User';
import { GroupDateTime } from 'pages/InstructorTaskManager/components/Groups/GroupDateTime';
import { MultiLineTextBlock } from 'components/MutliLineTextBlock/MultiLineTextBlock';
import { StudentFile } from 'resources/instructor/StudentFile';

type Props = {
    group: Group;
    user: User;
    handleStartCodeCompass: (f: StudentFile) => void;
    handleStopCodeCompass: (f: StudentFile) => void;
}

/**
 * Lists solutions for the given student
 * @param group
 * @param user
 * @param handleStartCodeCompass
 * @param handleStopCodeCompass
 * @constructor
 */
export function StudentSolutionsTab({
    group,
    user,
    handleStartCodeCompass,
    handleStopCodeCompass,
}: Props) {
    const { t } = useTranslation();
    const studentFiles = useStudentFilesForStudent(group.id, user.id);

    if (!studentFiles.data) {
        return null;
    }

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('task.solutions')}</CustomCardTitle>

            </CustomCardHeader>
            <StudentFilesList
                semesterID={group.semesterID}
                files={studentFiles.data}
                handleStartCodeCompass={handleStartCodeCompass}
                handleStopCodeCompass={handleStopCodeCompass}
                renderItem={(file) => (
                    <>
                        <DataRow label={t('task.task')}>{file.task?.name}</DataRow>
                        <DataRow label={t('task.uploadTime')}>
                            <GroupDateTime value={file.uploadTime} timezone={file.task?.group?.timezone || ''} />
                        </DataRow>
                        <DataRow label={t('task.delay')}>
                            {file.delay}
                        </DataRow>
                        <DataRow label={t('task.status')}>{file.translatedIsAccepted}</DataRow>
                        <DataRow label={t('task.uploadCount')}>{file.uploadCount}</DataRow>
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
