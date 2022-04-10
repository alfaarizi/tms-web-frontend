import React from 'react';
import { useTranslation } from 'react-i18next';

import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { CustomCard } from 'components/CustomCard/CustomCard';

type Props = {
    onBackClick: () => void,
}

export function TestNoGroupCard({
    onBackClick,
}: Props) {
    const { t } = useTranslation();
    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('examTests.newTest')}</CustomCardTitle>
            </CustomCardHeader>
            <p>
                {t('examTests.noGroupCreated')}
            </p>
            <ToolbarButton icon={faArrowLeft} text={t('common.back')} onClick={onBackClick} />
        </CustomCard>
    );
}
