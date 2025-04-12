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
import {
    Control,
    Controller,
    FieldPath,
    FieldValues,
    RegisterOptions,
} from 'react-hook-form';
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

type OptionItem<TValue> = {
    label: string,
    value: TValue,
    disabled?: boolean,
    title?: string,
}

type Props<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
    control: Control<TFieldValues, object>,
    name: TName,
    rules?: Omit<RegisterOptions<TFieldValues, TName>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>,
    // TODO instead of string|number, it should be T such that TFieldValues[TName] = Array<T>
    options: OptionItem<string | number>[],
}

export function DualListBoxControl<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
    control,
    name,
    options,
    rules,
}: Props<TFieldValues, TName>) {
    const { t } = useTranslation();

    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            defaultValue={([] as any)} // TODO can we express in the type system that control[name] should be an array?
            render={({ field }) => (
                <DualListBox
                    canFilter
                    alignActions="top"
                    filterPlaceholder={t('common.search')}
                    options={options}
                    selected={field.value}
                    onChange={field.onChange}
                    icons={icons}
                />
            )}
        />
    );
}
