import { useForm } from 'react-hook-form';

import { Form } from 'react-bootstrap';
import { FormError } from '@/components/FormError';
import { useTranslation } from 'react-i18next';
import { Task } from '@/resources/instructor/Task';
import { FormButtons } from '@/components/Buttons/FormButtons';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { DateTimePickerControl } from '@/components/DateTimePickerControl';
import { ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { useServersideFormErrors } from '@/ui-hooks/useServersideFormErrors';
import { MarkdownFormControl } from '@/components/MarkdownFormControl';
import { useTextPaste } from '@/ui-hooks/useTextPaste';

type Props = {
    title: string,
    timezone: string,
    onSave: (t: Task) => void,
    onCancel?: () => void,
    editData?: Task,
    showVersionControl: boolean,
    serverSideError: ValidationErrorBody | null,
    isLoading: boolean
}

export function TaskForm({
    title,
    timezone,
    onCancel,
    onSave,
    editData,
    showVersionControl,
    serverSideError,
    isLoading,
}: Props) {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        control,
        setValue,
        setError,
        clearErrors,

        formState: {
            errors,
        },
    } = useForm<Task>({
        defaultValues: editData,
    });

    useServersideFormErrors<Task>(clearErrors, setError, serverSideError);

    const handleTextPaste = useTextPaste(setValue);

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
                        onPaste={handleTextPaste}
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
                    <MarkdownFormControl
                        name="description"
                        control={control}
                        rules={{
                            required: false,
                        }}
                    />
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

                <Form.Group>
                    <Form.Label>
                        {t('task.restrictSubmissionAttempts.maxAttempts')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="number"
                        size="sm"
                        defaultValue={0}
                        {...register('submissionLimit', {
                            min: {
                                value: 0,
                                message: t('common.minValueRequired', { value: 0 }).toString(),
                            },
                            required: t('common.fieldRequired').toString(),
                        })}
                    />
                    {errors.submissionLimit && <FormError message={errors.submissionLimit.message} />}
                    <Form.Text className="text-muted">{t('task.submissionLimitHelp')}</Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('task.entryPassword')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="text"
                        {...register('entryPassword')}
                        size="sm"
                        onPaste={handleTextPaste}
                    />
                    {errors.entryPassword && <FormError message={errors.entryPassword.message} />}
                    <Form.Text className="text-muted">{t('task.entryPasswordHelp')}</Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('task.exitPassword')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="text"
                        {...register('exitPassword')}
                        size="sm"
                        onPaste={handleTextPaste}
                    />
                    {errors.exitPassword && <FormError message={errors.exitPassword.message} />}
                    <Form.Text className="text-muted">{t('task.exitPasswordHelp')}</Form.Text>
                </Form.Group>

                {showVersionControl
                    ? (
                        <Form.Group>
                            <Form.Check
                                id="enable-version-control"
                                type="checkbox"
                                label={t('task.isVersionControlled')}
                                {...register('isVersionControlled')}
                            />
                            <Form.Text className="text-muted">
                                {t('task.versionControlledHelp')}
                                {' '}
                                {t('task.exitPasswordGitPush')}
                            </Form.Text>
                        </Form.Group>
                    )
                    : null}

                <FormButtons onCancel={onCancel} isLoading={isLoading} />
            </Form>
        </CustomCard>
    );
}
