import React from 'react';
import styles from 'components/MutliLineTextBlock/MultiLineTextBlock.module.css';

type Props = {
    text: string | undefined | null;
}

/**
 * Renders the given string while preserver newlines and other whitespace characters
 * @param text
 * @constructor
 */
export function MultiLineTextBlock({ text }: Props) {
    return <div className={styles.multiLineTextBlock}>{text || ''}</div>;
}
