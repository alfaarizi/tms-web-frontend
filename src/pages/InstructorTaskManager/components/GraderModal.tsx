import { useForm } from 'react-hook-form';
import { Form, Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StudentFile } from 'resources/instructor/StudentFile';
import { FormButtons } from 'components/Buttons/FormButtons';
import { ConfirmModal } from 'components/Modals/ConfirmModal';

type Props = {
    file: StudentFile | null;
    show: boolean,
    onSave: (data: StudentFile) => void,
    onCancel: () => void
}

export function GraderModal({
    file,
    show,
    onCancel,
    onSave,
}: Props) {
    const { t } = useTranslation();
    const [confirmDialog, setConfirmDialog] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { isDirty, dirtyFields },
    } = useForm<StudentFile>();
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
            if (['Accepted', 'Passed'].includes(file.isAccepted)) {
                setValue('isAccepted', 'Accepted');
            } else if (['Rejected', 'Failed'].includes(file.isAccepted)) {
                setValue('isAccepted', 'Rejected');
            } else if (file.isAccepted === 'Late Submission') {
                setValue('isAccepted', file.isAccepted);
            } else {
                setValue('isAccepted', 'Accepted');
            }
            setValue('notes', file.notes);
            setValue('grade', file.grade);
        }
    };
    const selectValue = watch('isAccepted');

    const handleGraderExiting = () => {
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

    // Render
    return (
        <>
            <Modal
                show={show}
                animation
                size="lg"
                onShow={handleShow}
                onHide={handleGraderExiting}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t('task.grade')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onSubmit}>
                        <Form.Group>
                            <Form.Label>
                                {t('task.status')}
                                :
                            </Form.Label>
                            <Form.Control
                                as="select"
                                value={selectValue}
                                {...register('isAccepted', { required: true })}
                                size="sm"
                            >
                                <option value="Accepted">{t('status.accepted')}</option>
                                <option value="Rejected">{t('status.rejected')}</option>
                                <option value="Late Submission">{t('status.lateSubmission')}</option>

                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>
                                {t('task.notes')}
                                :
                            </Form.Label>
                            <Form.Control as="textarea" {...register('notes', { required: false })} size="sm" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>
                                {t('task.grade')}
                                :
                            </Form.Label>
                            <Form.Control
                                type="number"
                                size="sm"
                                step="0.01"
                                {...register('grade', { required: false })}
                            />
                        </Form.Group>
                        <FormButtons onCancel={handleGraderExiting} />
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
