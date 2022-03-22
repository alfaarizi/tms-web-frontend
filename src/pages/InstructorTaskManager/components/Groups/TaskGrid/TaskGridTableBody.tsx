import React from 'react';

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
    students.forEach((student) => {
        const row = (
            <tr key={student.id}>
                <td className={styles.studentNameCell}>
                    {student.name}
                </td>
                <td>
                    {student.neptun}
                </td>
                {taskList.map((task) => {
                    const file = getStudentFile(task.id, student.id);
                    const key = `${task.id}-${student.id}`;
                    return (
                        <td key={key} className="text-center">
                            {file ? <TaskGridCellButton studentFile={file} /> : '-'}
                        </td>
                    );
                })}
            </tr>
        );
        rows.push(row);
    });

    return <tbody>{rows}</tbody>;
}
