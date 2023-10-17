import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert, Button, Form, Spinner,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { UserAddResponse } from 'resources/instructor/UserAddResponse';
import { ErrorAlert } from 'components/ErrorAlert';
import { FormError } from 'components/FormError';
import { getFirstError } from 'utils/getFirstError';

type Props = {
    title: string,
    onAdd: (neptunCodes: string[]) => void,
    data?: UserAddResponse,
    isLoading: boolean
}

type FormData = {
    neptunCodes: string
}

function extractCodes(value: string): string[] {
    return value.split(' ')
        .filter((code) => code !== '')
        .filter((v, i, a) => a.indexOf(v) === i);
}

function validate(value: string): boolean {
    return extractCodes(value)
        .every((code) => code.length === 6);
}

export function AddUserCard({
    title,
    onAdd,
    data,
    isLoading,
}: Props) {
    const {
        register,
        handleSubmit,
        setValue,

        formState: {
            errors,
        },
    } = useForm<FormData>();
    const { t } = useTranslation();

    const onSubmit = handleSubmit((formData: FormData) => {
        const codes = extractCodes(formData.neptunCodes);
        onAdd(codes);
        setValue('neptunCodes', '');
    });

    const failed: string[] = data?.failed.map((user) => {
        const firstError = getFirstError(user.cause);
        if (firstError) {
            return `${user.neptun}: ${firstError}`;
        }
        return user.neptun;
    }) || [];

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{title}</CustomCardTitle>
            </CustomCardHeader>

            <Alert variant="success" show={!!data && data.addedUsers.length > 0}>
                {t('common.userAddSuccess', { count: data?.addedUsers.length })}
            </Alert>
            <ErrorAlert title={t('common.userAddFailed')} messages={failed} show={failed.length > 0} />

            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Control
                        type="text"
                        {...register('neptunCodes', {
                            required: true,
                            validate,
                        })}
                        size="sm"
                        placeholder={t('common.neptunCodes')}
                    />
                    {errors.neptunCodes && <FormError message={t('common.neptunCodesRequired')} />}
                </Form.Group>
                <Button variant="primary" type="submit" size="sm" disabled={isLoading}>
                    {isLoading ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faPlus} />}
                    {' '}
                    {t('common.add')}
                </Button>
            </Form>
        </CustomCard>
    );
}
