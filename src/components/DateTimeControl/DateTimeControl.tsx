import React from 'react';
import { Controller } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

type PickerProps = {
    value: string | null,
    onChange: (val: string | null) => void,
    onBlur: () => void
}

function DateTimePicker({
    onChange,
    value,
    onBlur,
}: PickerProps) {
    let date: string = '';
    let time: string = '';

    const parts: string[] = value?.split(' ') || [];
    if (parts.length === 2) {
        [date, time] = parts;
    }

    const handleDateChange = (dateValue: string) => {
        if (dateValue !== '') {
            if (time === '') {
                onChange(`${dateValue} 23:59:59`);
            } else {
                onChange(`${dateValue} ${time}`);
            }
        }
    };

    const handleTimeChange = (timeValue: string) => {
        if (timeValue !== '') {
            onChange(`${date} ${timeValue}`);
        }
    };

    const handleClear = () => {
        onChange('');
    };

    return (
        <div className="d-flex">
            <ToolbarButton icon={faTimes} onClick={handleClear} />
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
    );
}

type ControlProps = {
    name: string,
    rules: any,
    control: any
}

export function DateTimeControl({
    control,
    name,
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
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                />
            )}
        />
    );
}
