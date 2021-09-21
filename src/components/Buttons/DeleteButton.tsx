import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { Button, Modal } from 'react-bootstrap';

import { useShow } from 'ui-hooks/useShow';

type Props = {
    showText: boolean,
    onDelete: () => void
}

export function DeleteButton({
    onDelete,
    showText,
}: Props) {
    const { t } = useTranslation();
    const show = useShow();
    const text = showText ? t('common.delete') : '';

    const handleConfirm = () => {
        show.toHide();
        onDelete();
    };

    return (
        <>
            <ToolbarButton
                onClick={show.toShow}
                text={text}
                icon={faTrash}
            />
            <Modal show={show.show} onHide={show.toHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('common.confirmation')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{t('common.confirmDelete')}</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" size="sm" onClick={handleConfirm}>
                        <FontAwesomeIcon icon={faTrash} />
                        {' '}
                        {t('common.delete')}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={show.toHide}>
                        <FontAwesomeIcon icon={faTimes} />
                        {' '}
                        {t('common.cancel')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
