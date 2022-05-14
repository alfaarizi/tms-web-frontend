import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import React from 'react';
import { CodeCompassParameters } from 'resources/instructor/CodeCompassParameters';
import { FormError } from 'components/FormError';
import { FormButtons } from 'components/Buttons/FormButtons';

type Props = {
    parameters: CodeCompassParameters,
    inProgress: boolean,
    onSave: (task: CodeCompassParameters) => void
}

export function CodeCompassForm({
    parameters,
    inProgress,
    onSave,
}: Props) {
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,

        formState: {
            errors,
        },
    } = useForm<CodeCompassParameters>({
        defaultValues: parameters,
    });

    const onSubmit = handleSubmit((data: CodeCompassParameters) => {
        onSave(data);
    });

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>{t('codeCompass.packages')}</Form.Label>
                    <Form.Control
                        as="textarea"
                        {...register('packagesInstallInstructions')}
                        size="sm"
                        disabled={inProgress}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>{t('codeCompass.compileInstructions')}</Form.Label>
                    <Form.Control
                        as="textarea"
                        {...register('compileInstructions', { required: true })}
                        size="sm"
                        disabled={inProgress}
                    />
                    {errors.compileInstructions && <FormError message={t('common.fieldRequired')} />}
                </Form.Group>
                <FormButtons isLoading={inProgress} />
            </Form>
        </>
    );
}
