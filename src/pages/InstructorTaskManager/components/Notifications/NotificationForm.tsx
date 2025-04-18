import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormError } from '@/components/FormError';
import { ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { FormButtons } from '@/components/Buttons/FormButtons';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { Notification } from '@/resources/instructor/Notification';
import { useServersideFormErrors } from '@/ui-hooks/useServersideFormErrors';
import { DateTimePickerControl } from '@/components/DateTimePickerControl';
import { MarkdownFormControl } from '@/components/Markdown/MarkdownFormControl';

type Props = {
    title: string,
    timezone: string,
    onSave: (notification: Notification) => void,
    onCancel?: () => void
    editData?: Notification,
    serverSideError: ValidationErrorBody | null,
    isLoading:boolean
}

export function NotificationForm({
    title,
    timezone,
    onSave,
    onCancel,
    editData,
    serverSideError,
    isLoading,
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
    } = useForm<Notification>({
        defaultValues: editData,
    });
    useServersideFormErrors<Notification>(clearErrors, setError, serverSideError);

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
                <Form.Group>
                    <Form.Label>
                        {t('notification.message')}
                        :
                    </Form.Label>
                    <MarkdownFormControl
                        name="message"
                        control={control}
                        rules={
                            { required: t('common.fieldRequired').toString() }
                        }
                    />
                    {errors.message && <FormError message={errors.message.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('notification.startTime')}
                        :
                    </Form.Label>
                    <DateTimePickerControl
                        name="startTime"
                        timezone={timezone}
                        rules={{ required: t('common.fieldRequired').toString() }}
                        control={control}
                    />
                    {errors.startTime && <FormError message={errors.startTime.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('notification.endTime')}
                        :
                    </Form.Label>
                    <DateTimePickerControl
                        name="endTime"
                        timezone={timezone}
                        rules={{ required: t('common.fieldRequired').toString() }}
                        control={control}
                    />
                    {errors.endTime && <FormError message={errors.endTime.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        id="notificationForm-dismissible"
                        label={t('notification.dismissible')}
                        {...register('dismissible')}
                    />
                    <Form.Text className="text-muted">
                        {t('notification.dismissibleHelp')}
                    </Form.Text>
                </Form.Group>

                <FormButtons onCancel={onCancel} isLoading={isLoading} />
            </Form>
        </CustomCard>
    );
}
