import React from 'react';
// @ts-ignore
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronCircleDown,
    faChevronCircleUp,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const icons = {
    moveLeft: <FontAwesomeIcon icon={faChevronLeft} />,
    moveAllLeft: [
        <FontAwesomeIcon key={0} icon={faChevronLeft} />,
        <FontAwesomeIcon key={1} icon={faChevronLeft} />,
    ],
    moveRight: <FontAwesomeIcon icon={faChevronRight} />,
    moveAllRight: [
        <FontAwesomeIcon key={0} icon={faChevronRight} />,
        <FontAwesomeIcon key={1} icon={faChevronRight} />,
    ],
    moveDown: <FontAwesomeIcon icon={faChevronDown} />,
    moveUp: <FontAwesomeIcon icon={faChevronUp} />,
    moveTop: <FontAwesomeIcon icon={faChevronCircleUp} />,
    moveBottom: <FontAwesomeIcon icon={faChevronCircleDown} />,
};

function filterCallback(option: any, filterInput: any) {
    if (filterInput === '') {
        return true;
    }

    return (new RegExp(filterInput, 'i')).test(option.label);
}

type Props = {
    control: any,
    name: string,
    rules: any,
    options: any
}

export function DualListBoxControl({
    control,
    name,
    options,
    rules,
}: Props) {
    const { t } = useTranslation();

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            defaultValue={[]}
            render={({ field }) => (
                <DualListBox
                    canFilter
                    alignActions="top"
                    filterPlaceholder={t('common.search')}
                    filterCallback={filterCallback}
                    options={options}
                    selected={field.value}
                    onChange={field.onChange}
                    icons={icons}
                />
            )}
        />
    );
}
