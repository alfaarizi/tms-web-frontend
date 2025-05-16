import { Controller } from 'react-hook-form';
import { AsyncTypeahead, Token } from 'react-bootstrap-typeahead';
import { useTranslation } from 'react-i18next';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { User } from '@/resources/common/User';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import '@/components/AddUsers/AsyncTypeaheadControl.css';

interface Props {
    name: string, // the name of the form field
    id: string,
    rules: object,
    control: any,
    isSearchLoading: boolean,
    onSearch: (text: string) => void,
    searchData?: User[],
    allowNew?: boolean,
}

export function AsyncTypeaheadControl({
    name, id, rules, control, isSearchLoading, onSearch, searchData, allowNew = false,
}: Props) {
    const { t } = useTranslation();

    const formatOption = (opt: Option) : JSX.Element => {
        const userName = (opt as User).name;
        const userCode = ` (${(opt as User).userCode})`;
        return (
            <>
                <b>{userName}</b>
                {userCode}
            </>
        );
    };

    // Bypass client-side filtering by returning `true`. Results are already
    // filtered by the search endpoint, so no need to do it again.
    const filterBy = () => true;

    return (
        <Controller
            name={name}
            rules={rules}
            control={control}
            defaultValue={[]}
            render={({ field }) => (
                <AsyncTypeahead
                    allowNew={allowNew}
                    newSelectionPrefix={t('common.addNewUserCode')}
                    filterBy={filterBy}
                    id={id}
                    multiple
                    labelKey="userCode"
                    isLoading={isSearchLoading}
                    minLength={3}
                    onSearch={onSearch}
                    options={searchData || []}
                    onChange={field.onChange}
                    selected={field.value}
                    size="sm"
                    placeholder={t('common.searchForUserCodeOrName')}
                    renderMenuItemChildren={(option) => (
                        <span>
                            {formatOption(option)}
                        </span>
                    )}
                    renderToken={(option, { onRemove }, index) => (
                        <Token key={index} onRemove={onRemove} option={option}>
                            {formatOption(option)}
                        </Token>
                    )}
                />
            )}
        />
    );
}
