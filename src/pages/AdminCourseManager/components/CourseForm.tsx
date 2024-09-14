import React, { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormError } from 'components/FormError';
import { Course } from 'resources/common/Course';
import { FormButtons } from 'components/Buttons/FormButtons';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CreateOrUpdateCourse } from 'resources/common/CreateOrUpdateCourse';

type Props = {
    onSave: (course: CreateOrUpdateCourse) => void,
    onCancel?: () => void
    editData?: Course,
    title: string,
    isLoading: boolean
}

type CourseFormField = {
    name: string,
    codes: string,
};

export function CourseForm({
    onSave,
    onCancel,
    editData,
    title,
    isLoading,
}: Props) {
    const {
        register,
        handleSubmit,
        setValue,

        formState: {
            errors,
        },
    } = useForm<CourseFormField>();
    const { t } = useTranslation();

    useEffect(() => {
        if (editData) {
            setValue('name', editData.name);
            setValue('codes', editData.codes.join(', '));
        }
    }, [editData]);

    const splitCourseCodes = (value: string) => value.split(',')
        .map((code) => code.trim())
        .filter((code) => code !== '')
        .filter((code, index, self) => self.indexOf(code) === index);

    const onSubmit = handleSubmit(async (courseData: CourseFormField) => {
        const course: CreateOrUpdateCourse = {
            name: courseData.name,
            codes: splitCourseCodes(courseData.codes),
        };
        onSave(course);
    });

    const validateCourseCodes = (value: string) : string | undefined => {
        if (!value) {
            return undefined;
        }
        const invalidCodes = splitCourseCodes(value).filter((code) => code.length > 30);
        return invalidCodes.length > 0
            ? t('course.invalidCourseCodes', { maxLength: 30, codes: invalidCodes.join(', ') })
            : undefined;
    };

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>
                    re
                    {title}
                </CustomCardTitle>
            </CustomCardHeader>
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>
                        {t('common.name')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="text"
                        {...register('name', {
                            required: t('common.fieldRequired'),
                            maxLength: { value: 100, message: t('common.fieldMaxLength', { length: 100 }) },
                        })}
                        size="sm"
                    />
                    {errors.name && <FormError message={errors.name.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('course.codes')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="text"
                        {
                            ...register('codes', { required: false, validate: validateCourseCodes })}
                        size="sm"
                    />
                    <Form.Text className="text-muted">
                        {t('course.separateCodes')}
                    </Form.Text>
                    {errors.codes && <FormError message={errors.codes.message} />}

                </Form.Group>

                <FormButtons onCancel={onCancel} isLoading={isLoading} />
            </Form>
        </CustomCard>
    );
}
