import React from 'react';
import { Form } from 'react-bootstrap';
import { CustomCard } from 'components/CustomCard/CustomCard';

type Props = {
    toggleID: string,
    status: boolean,
    onToggle: () => void,
    disabled: boolean,
    label: string,
}

/**
 * Reusable toggle component
 * @param toggleID An unique id is required for the internal React-Bootstrap From.Check components
 * @param onToggle Toggle event handler
 * @param status Current status of the toggle component
 * @param disabled Disable toggle
 * @param label Label to display
 * @constructor
 */
export function Toggle({
    onToggle,
    status,
    disabled,
    label,
    toggleID,
}: Props) {
    return (
        <Form.Check
            checked={status}
            onChange={onToggle}
            type="switch"
            id={toggleID}
            disabled={disabled}
            label={label}
        />
    );
}
