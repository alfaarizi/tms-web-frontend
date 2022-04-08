import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faThumbsUp,
    faThumbsDown,
    faCheck,
    faTimes,
    faArrowUp,
    faArrowRotateLeft,
    faQuestion,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import { Variant } from 'react-bootstrap/types';
import { useTranslation } from 'react-i18next';

import { GridStudentFile } from 'resources/instructor/GridStudentFile';

import styles from 'pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGrid.module.css';

type Props = {
    studentFile: GridStudentFile,
}

/**
 * Shows a button with the status and the grade of the given student file
 * @param studentFile
 * @constructor
 */
export function TaskGridCellButton({ studentFile }: Props) {
    const { t } = useTranslation();
    let icon: IconDefinition;
    let variant: Variant;

    switch (studentFile.isAccepted) {
    case 'Accepted':
        icon = faThumbsUp;
        variant = 'success';
        break;
    case 'Rejected':
        icon = faThumbsDown;
        variant = 'danger';
        break;
    case 'Passed':
        icon = faCheck;
        variant = 'info';
        break;
    case 'Failed':
        icon = faTimes;
        variant = 'warning';
        break;
    case 'Uploaded':
        icon = faArrowUp;
        variant = 'secondary';
        break;
    case 'Late Submission':
        icon = faArrowRotateLeft;
        variant = 'dark';
        break;
    default:
        icon = faQuestion;
        variant = 'light';
        break;
    }

    const title = `${t('task.status')}: ${studentFile.translatedIsAccepted}`
        + `\n${t('task.grade')}: ${studentFile.grade || ''}`;

    return (
        <LinkContainer
            className={styles.taskGridCellButton}
            to={`/instructor/task-manager/student-files/${studentFile.id}`}
            title={title}
        >
            <Button variant={variant}>
                <FontAwesomeIcon icon={icon} />
                {studentFile.grade != null ? ` ${studentFile.grade}` : null}
            </Button>
        </LinkContainer>
    );
}
