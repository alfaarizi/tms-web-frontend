import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import { DateTime } from 'luxon';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { LocaleDateTime } from 'components/LocaleDateTime';

type PickerProps = {
    value: string | null,
    timezone: string,
    onChange: (val: string | null) => void,
    onBlur: () => void
}

/**
 * A controlled DateTimePicker component
 * @param onChange onChange event handler
 * @param value DateTime string (ISO 8601 format recommended)
 * @param timezone Name of the timezone
 * @param onBlur onBlur event handler
 * @constructor
 */
function DateTimePicker({
    onChange,
    value,
    timezone,
    onBlur,
}: PickerProps) {
    const { t } = useTranslation();

    // Format display values
    let date: string = '';
    let time: string = '';
    if (value) {
        const dt = DateTime.fromISO(value, { zone: timezone });
        date = dt.toFormat('yyyy-LL-dd');
        time = dt.toFormat('HH:mm');
    }

    const handleDateChange = (dateValue: string) => {
        if (dateValue !== '') {
            if (time === '') {
                const dt = DateTime.fromISO(`${dateValue}T23:59:00`, { zone: timezone });
                onChange(dt.toISO());
            } else {
                const dt = DateTime.fromISO(`${dateValue}T${time}`, { zone: timezone });
                onChange(dt.toISO());
            }
        }
    };

    const handleTimeChange = (timeValue: string) => {
        if (timeValue !== '') {
            const dt = DateTime.fromISO(`${date}T${timeValue}`, { zone: timezone });
            onChange(dt.toISO());
        }
    };

    const handleClear = () => {
        onChange('');
    };

    // Render
    return (
        <>
            <div className="d-flex">
                <ToolbarButton
                    icon={faTimes}
                    text={t('common.delete')}
                    displayTextBreakpoint="none"
                    onClick={handleClear}
                />
                <Form.Control
                    className="mx-1"
                    type="date"
                    size="sm"
                    onChange={(event) => handleDateChange(event.target.value)}
                    onBlur={onBlur}
                    value={date}
                />
                <Form.Control
                    type="time"
                    size="sm"
                    onChange={(event) => handleTimeChange(event.target.value)}
                    onBlur={onBlur}
                    value={time}
                    disabled={time === ''}
                />
            </div>
            <Form.Text className="text-muted">
                {t('common.timezone')}
                {': '}
                {timezone}
            </Form.Text>
            <Form.Text className="text-muted">
                {t('group.localTime')}
                {': '}
                {value ? <LocaleDateTime value={value} showTimeZone /> : null}
            </Form.Text>
        </>
    );
}

type ControlProps = {
    name: string,
    timezone: string,
    rules: any,
    control: any
}

/**
 * A React Hook Forms Controller to integrate the DateTimePicker component with the form library
 * @param control React Hook Forms control
 * @param name Name of the form field
 * @param timezone Name of the timezone
 * @param rules Form control validation rules
 * @constructor
 */
export function DateTimePickerControl({
    control,
    name,
    timezone,
    rules,
}: ControlProps) {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue=""
            rules={rules}
            render={({ field }) => (
                <DateTimePicker
                    value={field.value}
                    timezone={timezone}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                />
            )}
        />
    );
}
