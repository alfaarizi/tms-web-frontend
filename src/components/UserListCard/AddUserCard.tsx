import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert, Button, Form, Spinner, ToggleButton, ToggleButtonGroup,
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
import { Option } from 'react-bootstrap-typeahead/types/types';
import { User } from 'resources/common/User';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { AsyncTypeaheadControl } from 'components/AsyncTypeaheadControl';

type Props = {
    id: string,
    title: string,
    onAdd: (userCodes: string[]) => void,
    data?: UserAddResponse,
    isLoading: boolean,
    onSearch: (text: string) => void,
    searchData?: User[],
    isSearchLoading: boolean,
}

type FormData = {
    userCodes: string
}

type TypeaheadFormData = {
    selectedOptions: Option[]
}

function extractCodes(value: string): string[] {
    return value.split(' ')
        .filter((code) => code !== '')
        .filter((v, i, a) => a.indexOf(v) === i);
}

function validate(value: string): boolean {
    return extractCodes(value)
        .every((code) => code.match(/^[a-zA-Z0-9]{6}$/));
}

function validateList(value: string[]): boolean {
    return value.length > 0 && value.every((code) => code.match(/^[a-zA-Z0-9]{6}$/));
}

function validateOptions(value: Option[]): boolean {
    // custom options also have a userCode field (because of labelKey)
    return value.length > 0 && value.every((opt) => (opt as User).userCode.match(/^[a-zA-Z0-9]{6}$/));
}

export function AddUserCard({
    id,
    title,
    onAdd,
    data,
    isLoading,
    onSearch,
    searchData,
    isSearchLoading,
}: Props) {
    const {
        register,
        handleSubmit,
        setValue,

        formState: {
            errors,
        },
    } = useForm<FormData>();

    const {
        control,
        handleSubmit: handleSubmitTypeahead,
        setValue: setSelectedValue,
        formState: {
            errors: errorsTypeahead,
        },
    } = useForm<TypeaheadFormData>();

    const { t } = useTranslation();

    const onSubmit = handleSubmit((formData: FormData) => {
        const codes = extractCodes(formData.userCodes);
        onAdd(codes);
        setValue('userCodes', '');
    });

    const getSelectedUserCodes = (selectedOptions: Option[]) : string[] => {
        const codes : string[] = [];
        for (let i = 0; i < selectedOptions.length; i++) {
            const opt = selectedOptions[i];
            codes.push((opt as User).userCode);
        }
        return codes;
    };

    const onSubmitTypeahead = handleSubmitTypeahead((formData: TypeaheadFormData) => {
        const codes = getSelectedUserCodes(formData.selectedOptions);
        if (validateList(codes)) {
            onAdd(codes);
            setSelectedValue('selectedOptions', []);
        }
    });

    const failed: string[] = data?.failed.map((user) => {
        const firstError = getFirstError(user.cause);
        if (firstError) {
            return `${user.userCode}: ${firstError}`;
        }
        return user.userCode;
    }) || [];

    const [toggleValue, setToggleValue] = useState('off');
    const handleToggleChange = (val: string) => setToggleValue(val);
    const isAutocompleteSearchInUse = () => toggleValue === 'off';

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{title}</CustomCardTitle>
                <ToggleButtonGroup
                    type="radio"
                    name="search-types"
                    size="sm"
                    defaultValue="off"
                    value={toggleValue}
                    onChange={handleToggleChange}
                >
                    <ToggleButton id={`autocomplete-search-${id}`} value="off">
                        {t('common.autoCompleteSearch')}
                    </ToggleButton>
                    <ToggleButton id={`basic-search-${id}`} value="on">
                        {t('common.basicSearch')}
                    </ToggleButton>
                </ToggleButtonGroup>
            </CustomCardHeader>

            <Alert variant="success" show={!!data && data.addedUsers.length > 0}>
                {t('common.userAddSuccess', { count: data?.addedUsers.length })}
            </Alert>
            <ErrorAlert title={t('common.userAddFailed')} messages={failed} show={failed.length > 0} />

            {!isAutocompleteSearchInUse()
                && (
                    <Form onSubmit={onSubmit}>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                {...register('userCodes', {
                                    required: true,
                                    validate,
                                })}
                                size="sm"
                                placeholder={t('common.userCodes')}
                            />
                            {errors.userCodes && <FormError message={t('common.userCodesRequired')} />}
                        </Form.Group>

                        <Button variant="primary" type="submit" size="sm" disabled={isLoading}>
                            {isLoading ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faPlus} />}
                            {' '}
                            {t('common.add')}
                        </Button>
                    </Form>
                )}

            {isAutocompleteSearchInUse()
                && (
                    <Form onSubmit={onSubmitTypeahead}>
                        <Form.Group>
                            <AsyncTypeaheadControl
                                name="selectedOptions"
                                id={id}
                                rules={{
                                    required: true,
                                    validate: validateOptions,
                                }}
                                control={control}
                                isSearchLoading={isSearchLoading}
                                onSearch={onSearch}
                                searchData={searchData}
                            />
                            {errorsTypeahead.selectedOptions
                                && <FormError message={t('common.userCodeCodeOrNameRequired')} />}
                        </Form.Group>
                        <Button variant="primary" type="submit" size="sm" disabled={isLoading}>
                            {isLoading ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faPlus} />}
                            {' '}
                            {t('common.add')}
                        </Button>
                    </Form>
                )}
        </CustomCard>
    );
}
