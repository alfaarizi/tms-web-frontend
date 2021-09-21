import { useForm } from 'react-hook-form';
import { Form, Modal } from 'react-bootstrap';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { StudentFile } from 'resources/instructor/StudentFile';
import { FormButtons } from 'components/Buttons/FormButtons';

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
    const {
        register,
        handleSubmit,
        setValue,
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
        if (file) {
            setValue('isAccepted', 'Accepted');
            setValue('notes', file.notes);
            setValue('grade', file.grade);
        }
    };

    // Render
    return (
        <Modal show={show} onHide={onCancel} animation size="lg" onShow={handleShow}>
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
                        <Form.Control as="select" {...register('isAccepted', { required: true })} size="sm">
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

                    <FormButtons onCancel={onCancel} />
                </Form>
            </Modal.Body>
        </Modal>
    );
}
