import React, { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Form, Modal } from 'react-bootstrap';

import { FormError } from 'components/FormError';
import { MarkdownFormControl } from 'components/MarkdownFormControl';
import { ExamAnswer } from 'resources/instructor/ExamAnswer';
import { FormButtons } from 'components/Buttons/FormButtons';
import { InsertFunc } from 'components/ReactMdeWithCommands';

type Props = {
    title: string,
    show: boolean,
    onSave: (answer: ExamAnswer) => void,
    editData?: ExamAnswer | null
    onCancel: () => void,
    textError?: string,
    renderGallery: (insertFunc: InsertFunc) => ReactNode
}

export function AnswerFormModal({
    editData,
    onCancel,
    onSave,
    show,
    textError,
    title,
    renderGallery,
}: Props) {
    const { t } = useTranslation();
    const {
        handleSubmit,
        control,
        register,
        setError,
        setValue,

        formState: {
            errors,
        },
    } = useForm<ExamAnswer>();

    useEffect(() => {
        if (textError) {
            setError('text', { message: textError });
        }
    }, [textError]);

    useEffect(() => {
        if (editData) {
            setValue('text', editData.text);
            setValue('correct', editData.correct);
        }
    }, [editData]);

    const onSubmit = handleSubmit((data: ExamAnswer) => {
        onSave(data);
    });

    return (
        <Modal show={show} onHide={onCancel} animation size="lg">
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
                            label={t('examQuestions.correct')}
                            {...register('correct')}
                        />
                    </Form.Group>

                    <FormButtons onCancel={onCancel} />
                </Form>
            </Modal.Body>
        </Modal>
    );
}
