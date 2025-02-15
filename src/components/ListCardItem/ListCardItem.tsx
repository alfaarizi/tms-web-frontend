import { ReactNode } from 'react';
import styles from '@/components/ListCardItem/ListCardItem.module.css';

type Props = {
    children: ReactNode,
    onClick?: () => void,
    className?: string,
}

export function ListCardItem({
    children,
    onClick,
    className,
}: Props) {
    const classes: string[] = ['py-1', 'mb-1', 'border-bottom', 'border-gray'];

    if (className) {
        classes.push(className);
    }

    if (onClick) {
        classes.push(styles.clickable);
    }

    return (
        <div onClick={onClick} className={classes.join(' ')}>
            {children}
        </div>
    );
}
