import React from 'react';
import {
    Form, InputGroup, ToggleButton, ToggleButtonGroup,
} from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import RegExParser from 'regex-parser';

import { AsyncTypeaheadControl } from '@/components/AddUsers/AsyncTypeaheadControl';
import { FormError } from '@/components/FormError';
import { usePrivateSystemInfoQuery } from '@/hooks/common/SystemHooks';
import { User } from '@/resources/common/User';
import { extractUserCodes } from '@/utils/extractUserCodes';

import { useBranding } from '@/ui-hooks/useBranding';
import i18next from 'i18next';

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
    const userCodeFormat = RegExParser(usePrivateSystemInfoQuery().data?.userCodeFormat ?? '/.*/');

    const branding = useBranding();

    function validateImport(value: string) {
        const isValid = extractUserCodes(value)
            .every((code) => userCodeFormat.test(code));
        if (!isValid) {
            return t('common.userCodesRequired', { uniId: branding.universityIdentifierName[i18next.language] });
        }

        return undefined;
    }

    function validateOptions(value: Option[]) {
        // custom options also have an userCode field (because of labelKey)
        const isValid = value.length > 0 && value.every((opt) => userCodeFormat.test((opt as User).userCode));
        if (!isValid) {
            return t('common.userCodeOrNameRequired', { uniId: branding.universityIdentifierName[i18next.language] });
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
                            required: t('common.userCodeOrNameRequired', {
                                uniId: branding.universityIdentifierName[i18next.language],
                            }),
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
                        rules={{
                            validate: validateImport,
                            required: t('common.userCodesRequired', {
                                uniId: branding.universityIdentifierName[i18next.language],
                            }),
                        }}
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
                                placeholder={t('common.userCodes', {
                                    uniId: branding.universityIdentifierName[i18next.language],
                                })}
                            />
                        )}
                    />
                )}
            </InputGroup>
            {selectFieldErrorMessage && toggleValue === 'search' && <FormError message={selectFieldErrorMessage} />}
            {importFieldErrorMessage && toggleValue === 'import' && <FormError message={importFieldErrorMessage} />}
        </Form.Group>
    );
}
