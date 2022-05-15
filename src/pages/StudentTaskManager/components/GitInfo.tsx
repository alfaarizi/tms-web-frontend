import React from 'react';
import { useTranslation } from 'react-i18next';

import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { DataRow } from 'components/DataRow';

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
            {passwordProtected ? <p>{t('task.passwordProtectedGitPush')}</p> : null}
            <DataRow label={t('task.git.path')}>{path}</DataRow>
            <DataRow label={t('task.git.usage')}>{usage}</DataRow>
        </CustomCard>
    );
}
