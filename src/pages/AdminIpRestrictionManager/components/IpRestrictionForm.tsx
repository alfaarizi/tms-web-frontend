import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormError } from '@/components/FormError';
import { ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { FormButtons } from '@/components/Buttons/FormButtons';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { IpRestriction } from '@/resources/admin/IpRestriction';
import { useServersideFormErrors } from '@/ui-hooks/useServersideFormErrors';

type Props = {
    title: string,
    onSave: (ipRestriction: IpRestriction) => void,
    onCancel?: () => void,
    editData?: IpRestriction,
    serverSideError: ValidationErrorBody | null,
    isLoading: boolean
}

export function IpRestrictionForm({
    title,
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
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<IpRestriction>({
        defaultValues: editData,
    });

    // This hook handles server-side errors and maps them to the form fields.
    useServersideFormErrors<IpRestriction>(clearErrors, setError, serverSideError);

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
                        {t('ipRestriction.name')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder={t('ipRestriction.enterName')}
                        {...register('name', { required: t('common.fieldRequired').toString() })}
                        isInvalid={!!errors.name}
                    />
                    {errors.name && <FormError message={errors.name.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('ipRestriction.ipAddress')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder={t('ipRestriction.enterIpAddress')}
                        {...register('ipAddress', { required: t('common.fieldRequired').toString() })}
                        isInvalid={!!errors.ipAddress}
                    />
                    {errors.ipAddress && <FormError message={errors.ipAddress.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('ipRestriction.ipMask')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder={t('ipRestriction.enterIpMask')}
                        {...register('ipMask', { required: t('common.fieldRequired').toString() })}
                        isInvalid={!!errors.ipMask}
                    />
                    {errors.ipMask && <FormError message={errors.ipMask.message} />}
                </Form.Group>

                <FormButtons onCancel={onCancel} isLoading={isLoading} />
            </Form>
        </CustomCard>
    );
}
