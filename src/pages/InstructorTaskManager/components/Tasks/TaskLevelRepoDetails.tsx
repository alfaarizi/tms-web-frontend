import React from 'react';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { useTranslation } from 'react-i18next';

type Props = {
    url: string | undefined | null;
}

export function TaskLevelRepoDetails({ url }: Props) {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>
                    {t('task.git.taskLevelGitRepo')}
                </CustomCardTitle>
            </CustomCardHeader>

            {
                url ? (
                    <>
                        <p>
                            <strong>
                                {t('task.git.cloneRepo')}
                                :
                            </strong>
                            <br />
                            <kbd>
                                git clone --recurse-submodules
                                {' '}
                                {url}
                            </kbd>
                        </p>
                        <p>
                            <strong>
                                {t('task.git.updateAfterStudentListChanged')}
                                :
                            </strong>
                            <br />
                            <kbd>git pull</kbd>
                        </p>
                        <p className="mb-0">
                            <strong>
                                {t('task.git.getNewSolutions')}
                                :
                            </strong>
                            <br />
                            <kbd>git submodule update --recursive --remote</kbd>
                        </p>
                    </>
                ) : <p className="mb-0">{t('task.git.taskLevelGitRepoNotAvailable')}</p>

            }
        </CustomCard>
    );
}
