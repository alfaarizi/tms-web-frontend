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
import { MultiLineTextBlock } from 'components/MutliLineTextBlock/MultiLineTextBlock';

type Props = {
    group: Group;
    user: User;
}

/**
 * Lists solutions for the given student
 * @param group
 * @param user
 * @constructor
 */
export function StudentSolutionsTab({
    group,
    user,
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
                renderItem={(file) => (
                    <>
                        <DataRow label={t('task.task')}>{file.task?.name}</DataRow>
                        <DataRow label={t('task.uploadTime')}>{file.uploadTime}</DataRow>
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
