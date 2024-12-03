import React from 'react';
import { useTranslation } from 'react-i18next';

import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';

type Props = {
    path: string,
    usage: string,
    passwordProtected: boolean,
}

export function GitInfo({
    path,
    usage,
    passwordProtected,
}: Props) {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('task.git.gitRepo')}</CustomCardTitle>
            </CustomCardHeader>
            {passwordProtected ? <p>{t('task.task.exitPasswordGitPush')}</p> : null}
            <p>
                <strong>
                    {t('task.git.path')}
                    :
                </strong>
                <br />
                <kbd>{path}</kbd>
            </p>
            <p className="mb-0">
                <strong>
                    {t('task.git.usage')}
                    :
                </strong>
                <br />
                <kbd>{usage}</kbd>
            </p>
        </CustomCard>
    );
}
