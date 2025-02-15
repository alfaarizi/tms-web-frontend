import styles from '@/components/MutliLineTextBlock/MultiLineTextBlock.module.css';

type Props = {
    text: string | undefined | null;
    hasLengthLimit?: boolean;
};

/**
 * Renders the given string while preserver newlines and other whitespace characters
 * @param text
 * @constructor
 */
export function MultiLineTextBlock({ text, hasLengthLimit }: Props) {
    return (
        <div className={`${styles.multiLineTextBlock} ${hasLengthLimit ? styles.textTruncate : ''}`}>{text || ''}</div>
    );
}
