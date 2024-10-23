import React, { useEffect, useRef, useState } from 'react';

import { TaskGridCellButton } from 'pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGridCellButton';
import { User } from 'resources/common/User';
import { GridTask } from 'resources/instructor/GridTask.php';
import { GridSubmission } from 'resources/instructor/GridSubmission';

import styles from 'pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGrid.module.css';

type Props = {
    students: User[],
    taskList: GridTask[],
    getSubmission: (taskID: number, studentID: number) => GridSubmission | undefined,
};

/**
 * Contains student lists and renders task grid
 * @param getSubmission
 * @param students
 * @param taskList
 * @constructor
 */
export function TaskGridTableBody({ getSubmission, students, taskList }: Props) {
    const rows: JSX.Element[] = [];
    const ref = useRef<HTMLTableCellElement>(null);

    const [widthForLeft, setWidthForLeft] = useState<number>();

    useEffect(() => {
        if (ref.current !== null) {
            setWidthForLeft(ref.current.offsetWidth);
        }
    }, []);

    students.forEach((student) => {
        const row = (
            <tr key={student.id}>
                <td ref={ref} className={styles.stickyHead}>
                    {student.name}
                </td>
                <td style={{ left: widthForLeft }} className={styles.stickyHead}>
                    {student.userCode}
                </td>
                {taskList.map((task) => {
                    const file = getSubmission(task.id, student.id);
                    if (!file) {
                        return null;
                    }
                    const key = `${task.id}-${student.id}`;
                    return (
                        <td key={key} className="text-center">
                            <TaskGridCellButton submission={file} />
                        </td>
                    );
                })}
            </tr>
        );
        rows.push(row);
    });

    return <tbody>{rows}</tbody>;
}
