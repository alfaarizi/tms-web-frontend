import React from 'react';
import { useForm } from 'react-hook-form';

import { Form } from 'react-bootstrap';
import { FormError } from 'components/FormError';
import { useTranslation } from 'react-i18next';
import { Task } from 'resources/instructor/Task';
import { FormButtons } from 'components/Buttons/FormButtons';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { DateTimePickerControl } from 'components/DateTimePickerControl';
import { ValidationErrorBody } from 'exceptions/ServerSideValidationError';
import { useServersideFormErrors } from 'ui-hooks/useServersideFormErrors';

type Props = {
    title: string,
    timezone: string,
    onSave: (t: Task) => void,
    onCancel?: () => void,
    editData?: Task,
    showVersionControl: boolean,
    serverSideError: ValidationErrorBody | null
}

export function TaskForm({
    title,
    timezone,
    onCancel,
    onSave,
    editData,
    showVersionControl,
    serverSideError,
}: Props) {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        control,
        setError,
        clearErrors,

        formState: {
            errors,
        },
    } = useForm<Task>({
        defaultValues: editData,
    });
    useServersideFormErrors<Task>(clearErrors, setError, serverSideError);

    const onSubmit = handleSubmit((data) => {
        onSave(data);
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
                    <Form.Control
                        type="text"
                        {...register('name', { required: t('common.fieldRequired').toString() })}
                        size="sm"
                    />
                    {errors.name && <FormError message={errors.name.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('task.category')}
                        :
                    </Form.Label>
                    <Form.Control as="select" {...register('category', { required: true })} size="sm">
                        <option value="Smaller tasks">{t('task.categories.smallerTasks')}</option>
                        <option value="Larger tasks">{t('task.categories.largerTasks')}</option>
                        <option value="Classwork tasks">{t('task.categories.classworkTasks')}</option>
                        <option value="Exams">{t('task.categories.exams')}</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('task.description')}
                        :
                    </Form.Label>
                    <Form.Control as="textarea" {...register('description', { required: false })} size="sm" />
                    {errors.description && <FormError message={errors.description.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('task.available')}
                        :
                    </Form.Label>
                    <DateTimePickerControl
                        name="available"
                        timezone={timezone}
                        rules={{ required: false }}
                        control={control}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('task.softDeadLine')}
                        :
                    </Form.Label>
                    <DateTimePickerControl
                        name="softDeadline"
                        timezone={timezone}
                        rules={{ required: false }}
                        control={control}
                    />
                    {errors.softDeadline && <FormError message={errors.softDeadline.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('task.hardDeadLine')}
                        :
                    </Form.Label>
                    <DateTimePickerControl
                        name="hardDeadline"
                        timezone={timezone}
                        rules={{ required: t('common.fieldRequired').toString() }}
                        control={control}
                    />
                    {errors.hardDeadline && <FormError message={errors.hardDeadline.message} />}
                </Form.Group>

                {showVersionControl
                    ? (
                        <Form.Group>
                            <Form.Check
                                type="checkbox"
                                label={t('task.isVersionControlled')}
                                {...register('isVersionControlled')}
                            />
                            <Form.Text className="text-muted">
                                {t('task.versionControlledHelp')}
                            </Form.Text>
                        </Form.Group>
                    )
                    : null}

                <FormButtons onCancel={onCancel} />
            </Form>
        </CustomCard>
    );
}
