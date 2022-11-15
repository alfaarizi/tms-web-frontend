import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal } from 'react-bootstrap';

import { FormButtons } from 'components/Buttons/FormButtons';
import { useForm } from 'react-hook-form';
import { StudentNotes } from 'resources/instructor/StudentNotes';

type Props = {
    isActualSemester: boolean,
    data: StudentNotes | undefined,
    show: {show: boolean, toShow: () => void, toHide: () => void, toggle: () => void},
    submit: (noteData: StudentNotes) => Promise<void>,
    isLoading?: boolean | undefined
}

export function StudentNotesModal({
    isActualSemester,
    show,
    submit,
    data,
    isLoading,
}: Props) {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        setValue,
    } = useForm<StudentNotes>();
    const handleShow = () => {
        setValue('notes', data!.notes);
    };
    const onSubmit = handleSubmit(async (noteData) => {
        await submit(noteData);
    });
    return (
        <Modal show={show.show} onHide={show.toHide} onShow={handleShow}>
            <Modal.Header closeButton>
                <Modal.Title>{t('group.addNotes')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Label>{t('group.studentNotes')}</Form.Label>
                        <Form.Control
                            as="textarea"
                            {...register('notes', { required: false })}
                            size="sm"
                            disabled={!isActualSemester || isLoading}
                        />
                    </Form.Group>
                    { isActualSemester && <FormButtons onCancel={show.toHide} /> }
                </Form>
            </Modal.Body>
        </Modal>
    );
}
