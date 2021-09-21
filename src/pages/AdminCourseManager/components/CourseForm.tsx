import React from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormError } from 'components/FormError';
import { Course } from 'resources/common/Course';
import { FormButtons } from 'components/Buttons/FormButtons';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';

type Props = {
    onSave: (course: Course) => void,
    onCancel?: () => void
    editData?: Course,
    title: string
}

export function CourseForm({
    onSave,
    onCancel,
    editData,
    title,
}: Props) {
    const {
        register,
        handleSubmit,

        formState: {
            errors,
        },
    } = useForm<Course>({
        defaultValues: editData,
    });
    const { t } = useTranslation();

    const onSubmit = handleSubmit(async (data: Course) => {
        const newData = { ...data };
        if (editData) {
            newData.id = editData.id;
        }
        onSave(newData);
    });

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>
                    {title}
                </CustomCardTitle>
            </CustomCardHeader>
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>
                        {t('common.name')}
                        :
                    </Form.Label>
                    <Form.Control type="text" {...register('name', { required: true })} size="sm" />
                    {errors.name && <FormError message={t('common.requiredField')} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('course.code')}
                        :
                    </Form.Label>
                    <Form.Control type="text" {...register('code', { required: false })} size="sm" />
                </Form.Group>

                <FormButtons onCancel={onCancel} />
            </Form>
        </CustomCard>
    );
}
