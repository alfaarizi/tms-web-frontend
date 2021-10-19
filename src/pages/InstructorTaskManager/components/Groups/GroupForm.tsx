import React, { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormError } from 'components/FormError';
import { Group } from 'resources/instructor/Group';
import { ValidationErrorBody } from 'exceptions/ServerSideValidationError';
import { FormButtons } from 'components/Buttons/FormButtons';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { Course } from 'resources/common/Course';
import { useServersideFormErrors } from 'ui-hooks/useServersideFormErrors';
import timezones from 'i18n/timezones.json';
import { getUserTimezone } from 'utils/getUserTimezone';

type Props = {
    title: string,
    courses?: Course[],
    onSave: (group: Group) => void,
    onCancel?: () => void
    editData?: Group,
    serverSideError: ValidationErrorBody | null
}

export function GroupForm({
    title,
    courses,
    onSave,
    onCancel,
    editData,
    serverSideError,
}: Props) {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,

        formState: {
            errors,
        },
    } = useForm<Group>();
    useServersideFormErrors<Group>(clearErrors, setError, serverSideError);

    useEffect(() => {
        if (!!courses && courses.length > 0) {
            setValue('courseID', courses[0].id);
        }
    }, [courses]);

    useEffect(() => {
        if (editData) {
            setValue('number', editData.number);
            setValue('timezone', editData.timezone);
        } else {
            setValue('timezone', getUserTimezone());
        }
    }, [editData]);

    const onSubmit = handleSubmit(async (data) => {
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

                {!editData ? (
                    <Form.Group>
                        <Form.Label>
                            {t('course.course')}
                            :
                        </Form.Label>
                        <Form.Control
                            as="select"
                            {...register('courseID', {
                                required: t('group.courseIDRequired').toString(),
                            })}
                            size="sm"
                        >
                            {courses?.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
                        </Form.Control>
                        {errors.courseID && <FormError message={errors.courseID.message} />}
                    </Form.Group>
                ) : null}

                <Form.Group>
                    <Form.Label>
                        {t('group.number')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="number"
                        min="1"
                        {...register('number', {
                            required: false,
                            min: 1,
                        })}
                        size="sm"
                    />
                    {errors.number && <FormError message={errors.number.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('common.timezone')}
                        :
                    </Form.Label>
                    <Form.Control as="select" size="sm" {...register('timezone', { required: true })}>
                        {
                            timezones.map((timezone) => <option key={timezone} value={timezone}>{timezone}</option>)
                        }
                    </Form.Control>
                    {errors.number && <FormError message={errors.number.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Check type="checkbox" label={t('group.examGroup')} {...register('isExamGroup')} />
                    <Form.Text className="text-muted">
                        {t('group.examGroupHelp')}
                    </Form.Text>
                </Form.Group>

                <FormButtons onCancel={onCancel} />
            </Form>
        </CustomCard>
    );
}
