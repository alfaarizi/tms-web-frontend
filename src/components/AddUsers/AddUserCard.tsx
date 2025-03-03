import React, { useState } from 'react';
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
import { getFirstError } from 'utils/getFirstError';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { User } from 'resources/common/User';
import { AddUserFormControl, AddUserMode } from 'components/AddUsers/AddUserFormControl';
import { extractUserCodes } from 'utils/extractUserCodes';
import { getSelectedUserCodes } from 'utils/getSelectedUserCodes';
import { usePrivateSystemInfoQuery } from 'hooks/common/SystemHooks';

type Props = {
    id: string,
    title: string,
    onAdd: (userCodes: string[]) => void,
    data?: UserAddResponse,
    isLoading: boolean,
    onSearch: (text: string) => void,
    searchData?: User[],
    isSearchLoading: boolean,
    allowNew?: boolean,
}

type FormData = {
    importedUserCodes: string,
    selectedUserCodes: Option[]
}

function validateList(value: string[]): boolean {
    return value.length > 0 && value.every((code) => code
        .match(usePrivateSystemInfoQuery().data?.userCodeFormat ?? /.*/));
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
    allowNew = false,
}: Props) {
    const { t } = useTranslation();
    const {
        control,
        handleSubmit,
        setValue,

        formState: {
            errors,
        },
    } = useForm<FormData>();

    const [toggleValue, setToggleValue] = useState<AddUserMode>('search');

    const handleToggleChange = () => {
        setToggleValue((prevState) => (prevState === 'search' ? 'import' : 'search'));
    };

    const onSubmit = handleSubmit((formData: FormData) => {
        if (toggleValue === 'import') {
            const codes = extractUserCodes(formData.importedUserCodes);
            onAdd(codes);
            setValue('importedUserCodes', '');
        } else {
            const codes = getSelectedUserCodes(formData.selectedUserCodes);
            if (validateList(codes)) {
                onAdd(codes);
                setValue('selectedUserCodes', []);
            }
        }
    });

    const failed: string[] = data?.failed.map((user) => {
        const firstError = getFirstError(user.cause);
        if (firstError) {
            return `${user.userCode}: ${firstError}`;
        }
        return user.userCode;
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
                <AddUserFormControl
                    allowNew={allowNew}
                    toggleValue={toggleValue}
                    onToggle={handleToggleChange}
                    control={control}
                    id={id}
                    onSearch={onSearch}
                    searchData={searchData}
                    isSearchLoading={isSearchLoading}
                    selectFieldName="selectedUserCodes"
                    importFieldName="importedUserCodes"
                    selectFieldErrorMessage={errors.selectedUserCodes?.message}
                    importFieldErrorMessage={errors.importedUserCodes?.message}
                />

                <Button variant="primary" type="submit" size="sm" disabled={isLoading}>
                    {isLoading ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faPlus} />}
                    {' '}
                    {t('common.add')}
                </Button>
            </Form>

        </CustomCard>
    );
}
