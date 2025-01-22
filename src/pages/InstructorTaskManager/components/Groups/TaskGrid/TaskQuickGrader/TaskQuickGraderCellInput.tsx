import React from 'react';
import styles from 'pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGrid.module.css';
import { SubmissionGrade } from 'resources/instructor/SubmissionGrade';

type TaskQuickGraderCellInputProps = {
    submission: SubmissionGrade; // Directly accept the submission object
    onGradeSave: (updatedSubmission: SubmissionGrade) => void;
    tabIndex: number; // tabIndex for managing focus order
}

export function TaskQuickGraderCellInput({
    submission,
    onGradeSave,
    tabIndex,
}: TaskQuickGraderCellInputProps) {
    if (!submission) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newGrade = parseFloat(e.target.value);

        const updatedSubmission: SubmissionGrade = {
            id: submission.id,
            grade: newGrade,
            status: 'Accepted',
        };

        onGradeSave(updatedSubmission);
    };

    return (
        <input
            type="number"
            className={styles.taskQuickGraderCellInput}
            defaultValue={submission.grade}
            tabIndex={tabIndex}
            onFocus={(e) => e.target.select()}
            onChange={handleChange}
        />
    );
}
