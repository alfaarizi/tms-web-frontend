import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { Button, Modal } from 'react-bootstrap';

import { useShow } from '@/ui-hooks/useShow';
import { Breakpoint } from '@/components/Buttons/ResponsiveButtonText';

type Props = {
    displayTextBreakpoint?: Breakpoint,
    onDelete: () => void,
    itemName?: string,
    isLoading?: boolean,
    disabled?: boolean,
}

/**
 * Reusable delete button component that can be used in ButtonGroups and toolbars.
 * It shows a modal to confirm delete action.
 * @param onDelete A callback function to execute after delete confirmation
 * @param className Custom className applied to the Bootstrap Button component
 * @param displayTextBreakpoint The first viewport size where the button text is visible
 * @param itemName Name of the file, which will be mentioned in the dialogue
 * @param isLoading Show a spinner instead of the icon
 * @param disabled Disable button
 * @constructor
 */
export function DeleteToolbarButton({
    displayTextBreakpoint,
    onDelete,
    itemName,
    isLoading,
    disabled,
}: Props) {
    const { t } = useTranslation();
    const show = useShow();

    const handleConfirm = () => {
        show.toHide();
        onDelete();
    };

    return (
        <>
            <ToolbarButton
                onClick={show.toShow}
                text={t('common.delete')}
                icon={faTrash}
                displayTextBreakpoint={displayTextBreakpoint}
                isLoading={isLoading}
                disabled={disabled}
            />
            <Modal show={show.show} onHide={show.toHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('common.confirmation')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {t('common.confirmDelete')}
                    {itemName && <div><strong>{itemName}</strong></div>}
                </Modal.Body>
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
