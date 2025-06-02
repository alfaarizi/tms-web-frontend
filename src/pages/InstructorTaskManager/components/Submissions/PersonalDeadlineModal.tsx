import { useForm } from 'react-hook-form';
import { Form, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Submission } from '@/resources/instructor/Submission';
import { FormButtons } from '@/components/Buttons/FormButtons';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { DateTimePickerControl } from '@/components/DateTimePickerControl';

type Props = {
    file: Submission | null;
    show: boolean,
    onSave: (data: Submission) => void,
    onCancel: () => void,
    isLoading: boolean,
    timezone: string
}

export function PersonalDeadlineModal({
    file,
    show,
    onCancel,
    onSave,
    isLoading,
    timezone,
}: Props) {
    const { t } = useTranslation();
    const [confirmDialog, setConfirmDialog] = useState(false);
    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { isDirty, dirtyFields },
    } = useForm<Submission>();
    const onSubmit = handleSubmit((data) => {
        if (file) {
            onSave({
                ...data,
                id: file.id,
            });
        }
    });

    // Bootstrap modal onShow event handler
    // Sets field values
    const handleShow = () => {
        reset();
        if (file) {
            setValue('personalDeadline', file.personalDeadline);
        }
    };

    const handleHideModal = () => {
        if (isDirty || (Object.keys(dirtyFields).length !== 0)) {
            setConfirmDialog(true);
        } else {
            onCancel();
        }
    };

    const onConfirm = () => {
        setConfirmDialog(false);
        onCancel();
    };

    return (
        <>
            <Modal
                show={show}
                animation
                size="lg"
                onShow={handleShow}
                onHide={handleHideModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t('task.personalDeadline')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onSubmit}>
                        <Form.Group>
                            <Form.Label>
                                {t('task.personalDeadline')}
                                :
                            </Form.Label>
                            <DateTimePickerControl
                                name="personalDeadline"
                                timezone={timezone}
                                rules={{ required: false }}
                                control={control}
                            />
                        </Form.Group>
                        <FormButtons onCancel={handleHideModal} isLoading={isLoading} />
                    </Form>
                </Modal.Body>
            </Modal>
            <ConfirmModal
                description={t('common.confirmDiscard')}
                isConfirmDialogOpen={confirmDialog}
                onCancel={() => { setConfirmDialog(false); }}
                onConfirm={onConfirm}
                title={t('common.areYouSure')}
            />
        </>
    );
}
