import React from 'react';
import {
    Form, InputGroup, ToggleButton, ToggleButtonGroup,
} from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import { FormError } from '@/components/FormError';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { User } from '@/resources/common/User';
import { useTranslation } from 'react-i18next';
import { extractUserCodes } from '@/utils/extractUserCodes';
import { AsyncTypeaheadControl } from '@/components/AddUsers/AsyncTypeaheadControl';

type Props = {
    toggleValue: AddUserMode,
    onToggle: () => void,
    onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void,
    control: any,
    id: string,
    onSearch: (text: string) => void,
    searchData?: User[],
    isSearchLoading: boolean,
    importFieldName: string,
    selectFieldName: string,
    importFieldErrorMessage?: string,
    selectFieldErrorMessage?: string,
    allowNew?: boolean,
}

export type AddUserMode = 'search' | 'import';

export function AddUserFormControl({
    toggleValue,
    onToggle,
    onPaste,
    control,
    id,
    onSearch,
    searchData,
    isSearchLoading,
    importFieldName,
    selectFieldName,
    importFieldErrorMessage = undefined,
    selectFieldErrorMessage = undefined,
    allowNew = false,
}: Props) {
    const { t } = useTranslation();

    function validateImport(value: string) {
        const isValid = extractUserCodes(value)
            .every((code) => code.length === 6);
        if (!isValid) {
            return t('common.userCodesRequired');
        }

        return undefined;
    }

    function validateOptions(value: Option[]) {
        // custom options also have an userCode field (because of labelKey)
        const isValid = value.length > 0 && value.every((opt) => (opt as User).userCode.length === 6);
        if (!isValid) {
            return t('common.userCodeOrNameRequired');
        }

        return undefined;
    }

    return (
        <Form.Group>
            <InputGroup>
                <InputGroup.Prepend>
                    <ToggleButtonGroup
                        type="radio"
                        name="search-types"
                        size="sm"
                        defaultValue="search"
                        value={toggleValue}
                        onChange={onToggle}
                    >
                        <ToggleButton id={`autocomplete-search-${id}`} value="search" variant="outline-secondary">
                            {t('common.autoCompleteSearch')}
                        </ToggleButton>
                        <ToggleButton id={`basic-search-${id}`} value="import" variant="outline-secondary">
                            {t('common.basicSearch')}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </InputGroup.Prepend>

                {toggleValue === 'search' && (
                    <AsyncTypeaheadControl
                        allowNew={allowNew}
                        name={selectFieldName}
                        id={id}
                        rules={{
                            required: t('common.userCodeOrNameRequired'),
                            validate: validateOptions,
                        }}
                        control={control}
                        isSearchLoading={isSearchLoading}
                        onSearch={onSearch}
                        searchData={searchData}
                    />
                )}

                {toggleValue === 'import' && (
                    <Controller
                        control={control}
                        defaultValue=""
                        name={importFieldName}
                        rules={{ validate: validateImport, required: t('common.userCodesRequired') }}
                        render={({
                            field: {
                                onChange, onBlur, value, name,
                            },
                        }) => (
                            <Form.Control
                                type="text"
                                name={name}
                                onChange={onChange}
                                onBlur={onBlur}
                                onPaste={onPaste}
                                value={value}
                                size="sm"
                                placeholder={t('common.userCodes')}
                            />
                        )}
                    />
                )}
            </InputGroup>
            {selectFieldErrorMessage && toggleValue === 'search' && <FormError message={selectFieldErrorMessage} /> }
            {importFieldErrorMessage && toggleValue === 'import' && <FormError message={importFieldErrorMessage} /> }
        </Form.Group>
    );
}
