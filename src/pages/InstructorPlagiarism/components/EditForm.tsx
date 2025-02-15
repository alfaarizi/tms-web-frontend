import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { Plagiarism } from '@/resources/instructor/Plagiarism';
import { FormError } from '@/components/FormError';
import { FormButtons } from '@/components/Buttons/FormButtons';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { useTextPaste } from '@/ui-hooks/useTextPaste';

type Props = {
    editData: Plagiarism,
    onSave: (data: Plagiarism) => void,
    onCancel: () => void,
    isLoading:boolean
}

export function EditForm({
    editData,
    onCancel,
    onSave,
    isLoading,
}: Props) {
    const { t } = useTranslation();
    const {
        register,
        setValue,
        handleSubmit,

        formState: {
            errors,
        },
    } = useForm<Plagiarism>({
        defaultValues: editData,
    });

    const handleTextPaste = useTextPaste(setValue);

    const onSubmit = handleSubmit((data) => {
        onSave(data);
    });

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('common.edit')}</CustomCardTitle>
            </CustomCardHeader>
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>
                        {t('common.name')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="text"
                        {...register('name', { required: true })}
                        size="sm"
                        onPaste={handleTextPaste}
                    />
                    {errors.name && <FormError message={t('common.fieldRequired')} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('common.description')}
                        :
                    </Form.Label>
                    <Form.Control as="textarea" {...register('description', { required: false })} size="sm" />
                </Form.Group>

                <FormButtons onCancel={onCancel} isLoading={isLoading} />
            </Form>
        </CustomCard>
    );
}
