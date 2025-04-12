import { useTranslation } from 'react-i18next';

import { Group } from '@/resources/instructor/Group';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { SubmissionsList } from '@/pages/InstructorTaskManager/containers/Submissions/SubmissionsList';
import { DataRow } from '@/components/DataRow';
import { useSubmissionsForStudent } from '@/hooks/instructor/SubmissionHooks';
import { User } from '@/resources/common/User';
import { GroupDateTime } from '@/pages/InstructorTaskManager/components/Groups/GroupDateTime';
import { MultiLineTextBlock } from '@/components/MutliLineTextBlock/MultiLineTextBlock';
import { Submission } from '@/resources/instructor/Submission';

type Props = {
    group: Group;
    user: User;
    handleStartCodeCompass: (f: Submission) => void;
    handleStopCodeCompass: (f: Submission) => void;
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
    const submissions = useSubmissionsForStudent(group.id, user.id);

    if (!submissions.data) {
        return null;
    }

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('task.solutions')}</CustomCardTitle>

            </CustomCardHeader>
            <SubmissionsList
                semesterID={group.semesterID}
                files={submissions.data}
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
                        <DataRow label={t('task.status')}>{file.translatedStatus}</DataRow>
                        <DataRow label={t('passwordProtected.verified')}>
                            {file.verified ? t('common.yes') : t('common.no')}
                        </DataRow>
                        <DataRow label={t('task.uploadCount')}>{file.uploadCount}</DataRow>
                        <DataRow label={t('task.grade')}>{file.grade}</DataRow>
                        <DataRow label={t('task.graderName')}>{file.graderName}</DataRow>
                        <DataRow label={t('task.notes')}>
                            <MultiLineTextBlock text={file.notes} />
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
                                            {user.userCode}
                                        </kbd>
                                    ) : file.gitRepo}
                                </DataRow>
                            )
                            : null}
                    </>
                )}
            />
        </CustomCard>
    );
}
