import React from 'react';
import { useTranslation } from 'react-i18next';
import { faExternalLinkAlt, faPlay } from '@fortawesome/free-solid-svg-icons';
import { ButtonGroup } from 'react-bootstrap';

import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import styles from 'pages/InstructorPlagiarism/components/Results.module.css';

type Props = {
    responseURL: string | null,
    onRun: () => void,
    isRunning: boolean
}

export function Result({
    responseURL,
    onRun,
    isRunning,
}: Props) {
    const { t } = useTranslation();

    const openInNewTab = () => {
        // Force string; if it was `null`, the button with this
        // callback wouldn’t appear in the first place
        window.open(responseURL as string, '_blank');
    };

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('plagiarism.result')}</CustomCardTitle>
                <ButtonGroup>
                    <ToolbarButton
                        icon={faPlay}
                        text={t('plagiarism.runMoss')}
                        onClick={onRun}
                        isLoading={isRunning}
                    />
                    {responseURL
                        ? (
                            <ToolbarButton
                                icon={faExternalLinkAlt}
                                text={t('common.openInNewTab')}
                                onClick={openInNewTab}
                            />
                        ) : null}
                </ButtonGroup>
            </CustomCardHeader>
            {responseURL
                ? <iframe className={`${styles.results} w-100 h-100`} src={responseURL} title="Response" />
                : <p>{t('plagiarism.noResults')}</p>}
        </CustomCard>
    );
}
