import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Modal, Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

type ConfirmModalProps = {
    description: string;
    title: string;
    isConfirmDialogOpen: boolean;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

/**
 * Reusable confirmation modal component.
 * @param onConfirm A callback function to execute after confirmation
 * @param onCancel A callback function to execute after cancelation
 * @param description The description of the modal
 * @param title The title of the modal
 * @param isConfirmDialogOpen Define whether the modal should be visible or not
 * @param isLoading Optional property to disable buttons during loading
 * @constructor
 */
export function ConfirmModal({
    description, title, isConfirmDialogOpen, onConfirm, onCancel, isLoading = false,
}: ConfirmModalProps) {
    const { t } = useTranslation();

    return (
        <Modal show={isConfirmDialogOpen} animation size="sm" backdrop="static" onEscapeKeyDown={onCancel}>
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{description}</Modal.Body>
            <Modal.Footer>
                <Button variant="danger" size="sm" onClick={onConfirm} disabled={isLoading}>
                    {isLoading ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faCheck} />}
                    {' '}
                    {t(t('common.yes'))}
                </Button>
                <Button variant="secondary" size="sm" onClick={onCancel} disabled={isLoading}>
                    <FontAwesomeIcon icon={faTimes} />
                    {' '}
                    {t('common.no')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
