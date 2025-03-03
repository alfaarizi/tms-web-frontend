import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Form, Modal } from 'react-bootstrap';

import { FormError } from 'components/FormError';
import { QuizQuestion } from 'resources/instructor/QuizQuestion';
import { MarkdownFormControl } from 'components/MarkdownFormControl';
import { FormButtons } from 'components/Buttons/FormButtons';
import { InsertFunc } from 'components/ReactMdeWithCommands';
import { ConfirmModal } from 'components/Modals/ConfirmModal';

type Props = {
    title: string,
    show: boolean,
    onSave: (question: QuizQuestion) => void,
    editData?: QuizQuestion | null,
    onCancel: () => void,
    renderGallery: (insertFunc: InsertFunc) => ReactNode,
    isLoading:boolean
}

export function QuestionFormModal({
    title,
    show,
    editData,
    onSave,
    onCancel,
    renderGallery,
    isLoading,
}: Props) {
    const { t } = useTranslation();
    const [confirmDialog, setConfirmDialog] = useState(false);
    const {
        reset,
        handleSubmit,
        control,
        setValue,
        formState: {
            errors, dirtyFields, isDirty,
        },
    } = useForm<QuizQuestion>();

    const handleShow = () => {
        // Set edit data or clear form fields
        reset();
        if (editData) {
            setValue('text', editData.text);
        } else {
            setValue('text', '');
        }
    };

    const onSubmit = handleSubmit((data) => {
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
                    <Form onSubmit={onSubmit} className="py-1">
                        <Form.Group>
                            <MarkdownFormControl
                                name="text"
                                control={control}
                                renderGallery={renderGallery}
                                rules={{
                                    required: t('common.fieldRequired')
                                        .toString(),
                                }}
                            />
                            {errors.text && <FormError message={errors.text.message} />}
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
