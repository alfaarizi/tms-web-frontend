import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Form, Modal } from 'react-bootstrap';

import { FormError } from 'components/FormError';
import { FormButtons } from 'components/Buttons/FormButtons';
import { TestCase } from 'resources/instructor/TestCase';
import { ConfirmModal } from 'components/Modals/ConfirmModal';

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
        reset,
        formState: {
            errors, isDirty, dirtyFields,
        },
    } = useForm<TestCase>();

    const [confirmDialog, setConfirmDialog] = useState(false);

    useEffect(() => {
        reset();
        if (editData) {
            setValue('arguments', editData.arguments);
            setValue('input', editData.input);
            setValue('output', editData.output);
        } else {
            setValue('arguments', '');
            setValue('input', '');
            setValue('output', '');
        }
    }, [show]);

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
            <Modal show={show} onHide={handleGraderExiting} animation size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onSubmit}>

                        <Form.Group>
                            <Form.Label>
                                {t('task.autoTester.arguments')}
                                :
                            </Form.Label>
                            <Form.Control type="text" {...register('arguments', { required: false })} />
                            <Form.Text className="text-muted">
                                {t('task.autoTester.argumentsHelp')}
                            </Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                {t('task.autoTester.input')}
                                :
                            </Form.Label>
                            <Form.Control as="textarea" {...register('input', { required: false })} />
                            <Form.Text className="text-muted">
                                {t('task.autoTester.inputHelp')}
                            </Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                {t('task.autoTester.output')}
                                :
                            </Form.Label>
                            <Form.Control as="textarea" {...register('output', { required: true })} />
                            <Form.Text className="text-muted">
                                {t('task.autoTester.outputHelp')}
                            </Form.Text>
                            {errors.output && <FormError message={t('common.fieldRequired')} />}
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
