import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import styles from '@/pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGrid.module.css';
import { SubmissionGrade } from '@/resources/instructor/SubmissionGrade';

type TaskQuickGraderCellInputProps = {
    submission: SubmissionGrade; // Directly accept the submission object
    onGradeSave: (updatedSubmission: SubmissionGrade) => void;
    tabIndex: number; // tabIndex for managing focus order
}

export function TaskQuickGraderCellInput({ submission, onGradeSave, tabIndex }: TaskQuickGraderCellInputProps) {
    const [savedStated, setSavedState] = useState<'saved' | 'modified' | 'unchanged'>('unchanged');

    if (!submission) return null;

    const getClassNameFromState = () => {
        switch (savedStated) {
        case 'saved':
            return 'border-success';
        case 'modified':
            return 'border-danger';
        default:
            return '';
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };
    const handleChange = () => {
        setSavedState('modified');
    };
    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newGrade = parseFloat(e.target.value);

        // Check the old value do determine if saving is needed
        if (submission.grade !== newGrade) {
            const updatedSubmission: SubmissionGrade = {
                id: submission.id,
                grade: newGrade,
                status: 'Accepted',
            };

            onGradeSave(updatedSubmission);
            setSavedState('saved');
        } else {
            setSavedState('unchanged');
        }
    };

    return (
        <Form.Control
            type="number"
            className={`${styles.taskQuickGraderCellInput} border ${getClassNameFromState()}`}
            defaultValue={submission.grade}
            tabIndex={tabIndex}
            onFocus={handleFocus}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
}
