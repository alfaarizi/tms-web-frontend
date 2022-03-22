import React, { ReactNode } from 'react';
import { Table } from 'react-bootstrap';
import { CustomCard } from 'components/CustomCard/CustomCard';

import styles from 'pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGrid.module.css';

type Props = {
    children: ReactNode,
}

/**
 * Styled card and table for task grid
 * @param children
 * @constructor
 */
export function TaskGridTableCard({ children }: Props) {
    return (
        <CustomCard>
            <div className={styles.taskGridTableContainer}>
                <Table className="w-auto" size="sm" hover striped bordered>
                    {children}
                </Table>
            </div>
        </CustomCard>
    );
}
