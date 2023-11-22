import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Form, Modal } from 'react-bootstrap';

import { FormError } from 'components/FormError';
import { MarkdownFormControl } from 'components/MarkdownFormControl';
import { ExamAnswer } from 'resources/instructor/ExamAnswer';
import { FormButtons } from 'components/Buttons/FormButtons';
import { InsertFunc } from 'components/ReactMdeWithCommands';
import { ConfirmModal } from 'components/Modals/ConfirmModal';

type Props = {
    title: string,
    show: boolean,
    onSave: (answer: ExamAnswer) => void,
    editData?: ExamAnswer | null
    onCancel: () => void,
    textError?: string,
    renderGallery: (insertFunc: InsertFunc) => ReactNode,
    isLoading:boolean
}

export function AnswerFormModal({
    editData,
    onCancel,
    onSave,
    show,
    textError,
    title,
    renderGallery,
    isLoading,
}: Props) {
    const { t } = useTranslation();
    const {
        handleSubmit,
        control,
        register,
        setError,
        setValue,
        reset,
        formState: {
            errors, isDirty, dirtyFields,
        },
    } = useForm<ExamAnswer>();

    const [confirmDialog, setConfirmDialog] = useState(false);

    useEffect(() => {
        if (textError) {
            setError('text', { message: textError });
        }
    }, [textError]);

    const handleShow = () => {
        reset();
        // Set edit data or clear form fields
        if (editData) {
            setValue('text', editData.text);
            setValue('correct', editData.correct);
        } else {
            setValue('text', '');
            setValue('correct', 0);
        }
    };

    const onSubmit = handleSubmit((data: ExamAnswer) => {
        onSave(data);
    });

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

    return (
        <>
            <Modal show={show} onHide={handleGraderExiting} onShow={handleShow} animation size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onSubmit}>
                        <Form.Group>
                            <MarkdownFormControl
                                renderGallery={renderGallery}
                                name="text"
                                control={control}
                                rules={{
                                    required: t('common.fieldRequired')
                                        .toString(),
                                }}
                            />
                            {errors.text && <FormError message={errors.text.message} />}
                        </Form.Group>

                        <Form.Group>
                            <Form.Check
                                type="checkbox"
                                id="correct"
                                label={t('examQuestions.correct')}
                                {...register('correct')}
                            />
                        </Form.Group>
                        <FormButtons onCancel={handleGraderExiting} isLoading={isLoading} />
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
