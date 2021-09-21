import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Form, Modal } from 'react-bootstrap';

import { FormError } from 'components/FormError';
import { FormButtons } from 'components/Buttons/FormButtons';
import { TestCase } from 'resources/instructor/TestCase';

type Props = {
    title: string,
    show: boolean,
    onSave: (answer: TestCase) => void,
    editData?: TestCase | null
    onCancel: () => void,
}

export function TestCaseFormModal({
    title,
    show,
    onSave,
    editData,
    onCancel,
}: Props) {
    const { t } = useTranslation();
    const {
        handleSubmit,
        register,
        setValue,

        formState: {
            errors,
        },
    } = useForm<TestCase>();

    useEffect(() => {
        if (editData) {
            setValue('input', editData.input);
            setValue('output', editData.output);
        } else {
            setValue('input', '');
            setValue('output', '');
        }
    }, [show]);

    const onSubmit = handleSubmit((data) => {
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
                        <Form.Label>
                            {t('task.autoTester.input')}
                            :
                        </Form.Label>
                        <Form.Control as="textarea" {...register('input', { required: true })} />
                        {errors.input && <FormError message={t('common.fieldRequired')} />}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            {t('task.autoTester.output')}
                            :
                        </Form.Label>
                        <Form.Control as="textarea" {...register('output', { required: true })} />
                        {errors.output && <FormError message={t('common.fieldRequired')} />}
                    </Form.Group>

                    <FormButtons onCancel={onCancel} />
                </Form>
            </Modal.Body>
        </Modal>
    );
}
