import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal } from 'react-bootstrap';

import { FormButtons } from 'components/Buttons/FormButtons';
import { useForm } from 'react-hook-form';
import { StudentNotes } from 'resources/instructor/StudentNotes';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { User } from 'resources/common/User';

type Props = {
    isActualSemester: boolean,
    student: User,
    data: StudentNotes | undefined,
    show: {show: boolean, toShow: () => void, toHide: () => void, toggle: () => void},
    submit: (noteData: StudentNotes) => Promise<void>,
    isLoading?: boolean | undefined
}

export function StudentNotesModal({
    isActualSemester,
    student,
    show,
    submit,
    data,
    isLoading,
}: Props) {
    const { t } = useTranslation();
    const {
        reset,
        register,
        handleSubmit,
        setValue,
        formState: {
            dirtyFields, isDirty,
        },
    } = useForm<StudentNotes>();

    const [confirmDialog, setConfirmDialog] = useState(false);

    const handleShow = () => {
        reset();
        if (data) {
            setValue('notes', data.notes);
        } else {
            setValue('notes', '');
        }
    };
    const onSubmit = handleSubmit(async (noteData) => {
        await submit(noteData);
    });

    const handleGraderExiting = () => {
        if (isDirty || (Object.keys(dirtyFields).length !== 0)) {
            setConfirmDialog(true);
        } else {
            show.toHide();
        }
    };

    const onConfirm = () => {
        setConfirmDialog(false);
        show.toHide();
    };

    return (
        <>
            <Modal show={show.show} onHide={handleGraderExiting} onShow={handleShow}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('group.addNotes')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onSubmit}>
                        <Form.Group>
                            <Form.Label>
                                {`${t('group.studentNotes')}: 
                                ${student.name ? `${student.name} (${student.neptun})` : student.neptun}`}
                            </Form.Label>
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
