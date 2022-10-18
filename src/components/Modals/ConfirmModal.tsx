import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

type ConfirmModalProps = {
    description: string;
    title: string;
    isConfirmDialogOpen: boolean;
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
 * @constructor
 */
export function ConfirmModal(props: ConfirmModalProps) {
    const {
        description, title, isConfirmDialogOpen, onConfirm, onCancel,
    } = props;

    const { t } = useTranslation();

    return (
        <Modal show={isConfirmDialogOpen} animation size="sm" backdrop="static">
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{description}</Modal.Body>
            <Modal.Footer>
                <Button variant="danger" size="sm" onClick={onConfirm}>
                    <FontAwesomeIcon icon={faTrash} />
                    {' '}
                    {t(t('common.yes'))}
                </Button>
                <Button variant="secondary" size="sm" onClick={onCancel}>
                    <FontAwesomeIcon icon={faTimes} />
                    {' '}
                    {t('common.no')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
