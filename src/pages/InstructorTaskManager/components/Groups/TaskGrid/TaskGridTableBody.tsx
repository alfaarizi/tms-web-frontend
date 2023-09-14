import React, { useEffect, useRef, useState } from 'react';

import { TaskGridCellButton } from 'pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGridCellButton';
import { User } from 'resources/common/User';
import { GridTask } from 'resources/instructor/GridTask.php';
import { GridStudentFile } from 'resources/instructor/GridStudentFile';

import styles from 'pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGrid.module.css';

type Props = {
    students: User[],
    taskList: GridTask[],
    getStudentFile: (taskID: number, studentID: number) => GridStudentFile | undefined,
};

/**
 * Contains student lists and renders task grid
 * @param getStudentFile
 * @param students
 * @param taskList
 * @constructor
 */
export function TaskGridTableBody({ getStudentFile, students, taskList }: Props) {
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
                    {student.neptun}
                </td>
                {taskList.map((task) => {
                    const file = getStudentFile(task.id, student.id);
                    if (!file) {
                        return null;
                    }
                    const key = `${task.id}-${student.id}`;
                    return (
                        <td key={key} className="text-center">
                            <TaskGridCellButton studentFile={file} />
                        </td>
                    );
                })}
            </tr>
        );
        rows.push(row);
    });

    return <tbody>{rows}</tbody>;
}
