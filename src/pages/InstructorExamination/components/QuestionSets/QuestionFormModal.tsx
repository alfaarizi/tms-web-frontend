import React, { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Form, Modal } from 'react-bootstrap';

import { FormError } from 'components/FormError';
import { ExamQuestion } from 'resources/instructor/ExamQuestion';
import { MarkdownFormControl } from 'components/MarkdownFormControl';
import { FormButtons } from 'components/Buttons/FormButtons';
import { InsertFunc } from 'components/ReactMdeWithCommands';

type Props = {
    title: string,
    show: boolean,
    onSave: (question: ExamQuestion) => void,
    editData?: ExamQuestion | null,
    onCancel: () => void,
    renderGallery: (insertFunc: InsertFunc) => ReactNode
}

export function QuestionFormModal({
    title,
    show,
    editData,
    onSave,
    onCancel,
    renderGallery,
}: Props) {
    const { t } = useTranslation();
    const {
        handleSubmit,
        control,
        setValue,

        formState: {
            errors,
        },
    } = useForm<ExamQuestion>();

    useEffect(() => {
        if (editData) {
            setValue('text', editData.text);
        }
    }, [editData]);

    const onSubmit = handleSubmit((data) => {
        onSave(data);
    });

    return (
        <Modal show={show} onHide={onCancel} animation size="lg">
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

                    <FormButtons onCancel={onCancel} />
                </Form>
            </Modal.Body>
        </Modal>
    );
}
