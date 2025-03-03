import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

type Props = {
    value: boolean,
    showText: boolean
}

export function IsCorrect({
    value,
    showText,
}: Props) {
    const { t } = useTranslation();

    const icon = value ? faCheck : faTimes;
    let text = '';
    if (showText) {
        text = value ? t('quizQuestions.correct') : t('quizQuestions.wrong');
    }

    return (
        <span>
            <FontAwesomeIcon icon={icon} />
            {' '}
            {text}
        </span>
    );
}
