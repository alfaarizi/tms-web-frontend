import React, { useEffect, useState, useRef } from 'react';
import { User } from 'resources/common/User';
import { GridTask } from 'resources/instructor/GridTask.php';
import { GridSubmission } from 'resources/instructor/GridSubmission';
import styles from 'pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGrid.module.css';
import {
    TaskQuickGraderCellInput,
} from 'pages/InstructorTaskManager/components/Groups/TaskGrid/TaskQuickGrader/TaskQuickGraderCellInput';
import { SubmissionGrade } from 'resources/instructor/SubmissionGrade';

type Props = {
    students: User[];
    taskList: GridTask[];
    getSubmission: (taskID: number, studentID: number) => GridSubmission | undefined;
    onGradeSave: (data: SubmissionGrade) => void; // Prop for grade save
};

export function TaskQuickGraderTableBody({
    getSubmission,
    students,
    taskList,
    onGradeSave,
}: Props) {
    const [tabIndexMapping, setTabIndexMapping] = useState<number[][]>([]);
    const [widthForLeft, setWidthForLeft] = useState<number>(0);
    const firstCellRef = useRef<HTMLTableCellElement | null>(null);
    const cellRefs = useRef<(HTMLTableCellElement | null)[][]>([]);

    // Initialize cellRefs for students and tasks
    useEffect(() => {
        if (students.length === 0 || taskList.length === 0) return;

        // Generate tabIndex mapping for TaskQuickC\GraderCellInput inputs
        const generateTabIndex = () => {
            const mapping: number[][] = [];
            const totalCols = taskList.length + 2; // Name + userCode columns
            const totalRows = students.length;

            // Generate tabIndex in column-major order (top to bottom in each column)
            let index = 1;
            for (let colIndex = 0; colIndex < totalCols; colIndex++) {
                const columnTabIndexes: number[] = [];
                for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
                    // Set tabIndex from top to bottom in each column
                    columnTabIndexes.push(index);
                    index += 1;
                }
                mapping.push(columnTabIndexes);
            }

            setTabIndexMapping(mapping);
        };

        // Initialize refs for each cell if they are not initialized yet
        if (cellRefs.current.length === 0) {
            cellRefs.current = students.map(() => []);
        }

        generateTabIndex();
    }, [students, taskList]);

    // Set width for sticky columns (name and userCode)
    useEffect(() => {
        if (firstCellRef.current) {
            setWidthForLeft(firstCellRef.current.offsetWidth);
        }
    }, [students]);

    const renderTaskCell = (task: GridTask, student: User, rowIndex: number, colIndex: number) => {
        const file = getSubmission(task.id, student.id);
        if (!file) {
            return null;
        }
        const key = `${task.id}-${student.id}`;
        const submission: SubmissionGrade = {
            id: file.id,
            grade: file.grade,
            status: file.status,
        };
        return (
            <td
                key={key}
                className="text-center"
                ref={(el) => {
                    cellRefs.current[rowIndex][colIndex] = el;
                }}
            >
                <div role="button">
                    <TaskQuickGraderCellInput
                        submission={submission}
                        onGradeSave={onGradeSave}
                        tabIndex={tabIndexMapping[colIndex]?.[rowIndex] ?? -1}
                    />
                </div>
            </td>
        );
    };

    // Render row for a student
    const renderStudentRow = (student: User, rowIndex: number) => (
        <tr key={student.id}>
            <td ref={firstCellRef} className={styles.stickyHead}>{student.name}</td>
            <td style={{ left: widthForLeft }} className={styles.stickyHead}>
                {student.userCode}
            </td>
            {taskList.map((task, colIndex) => renderTaskCell(task, student, rowIndex, colIndex + 2))}
        </tr>
    );

    if (tabIndexMapping.length === 0) {
        return null;
    }

    return <tbody>{students.map(renderStudentRow)}</tbody>;
}
