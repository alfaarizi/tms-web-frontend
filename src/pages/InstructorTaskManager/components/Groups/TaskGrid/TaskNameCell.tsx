import { ReactNode } from 'react';
import styles from '@/pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGrid.module.css';

type Props = {
    children: ReactNode,
};

/**
 * Rotated cell for task names
 * @param children
 * @constructor
 */
export function TaskNameCell({ children }: Props) {
    return (
        <th className={styles.taskNameCell}>
            <span>
                {children}
            </span>
        </th>
    );
}
