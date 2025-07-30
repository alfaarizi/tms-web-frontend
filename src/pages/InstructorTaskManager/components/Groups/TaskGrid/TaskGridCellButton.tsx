import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faThumbsUp,
    faThumbsDown,
    faCheck,
    faTimes,
    faArrowUp,
    faLock,
    faQuestion,
    faMinus,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import { Variant } from 'react-bootstrap/types';
import { useTranslation } from 'react-i18next';

import { GridSubmission } from '@/resources/instructor/GridSubmission';

import styles from '@/pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGrid.module.css';

type Props = {
    submission: GridSubmission,
};

/**
 * Shows a button with the status and the grade of the given submission
 * @param submission
 * @constructor
 */
export function TaskGridCellButton({ submission }: Props) {
    const { t } = useTranslation();
    let icon: IconDefinition;
    let variant: Variant;

    switch (submission.status) {
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
    case 'No Submission':
        icon = faMinus;
        variant = 'light';
        break;
    default:
        icon = faQuestion;
        variant = 'light';
        break;
    }
    const title = `${t('task.status')}: ${submission.translatedStatus}`
        + `\n${t('passwordProtected.verified')}: ${submission.verified ? t('common.yes') : t('common.no')}`
        + `\n${t('task.grade')}: ${submission.grade || ''}`;

    return (
        <LinkContainer
            className={styles.taskGridCellButton}
            to={`/instructor/task-manager/submissions/${submission.id}`}
            title={title}
        >
            <Button variant={variant}>
                <div className={`fa-stack ${styles.buttonText}`}>
                    {!submission.verified && (
                        <FontAwesomeIcon
                            className={`${styles.lockIcon} }`}
                            icon={faLock}
                        />
                    )}
                    <FontAwesomeIcon icon={icon} className="" />
                    {submission.grade != null ? ` ${submission.grade}` : null}
                </div>
            </Button>
        </LinkContainer>
    );
}
