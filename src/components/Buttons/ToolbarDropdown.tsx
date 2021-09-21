import React, { ReactNode } from 'react';
import { ButtonGroup, DropdownButton } from 'react-bootstrap';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
    children: ReactNode,
    title?: string,
    icon?: IconProp,
    disabled?: boolean
}

export function ToolbarDropdown({
    children,
    icon,
    title,
    disabled,
}: Props) {
    return (
        <DropdownButton
            as={ButtonGroup}
            disabled={disabled}
            title={(
                <>
                    {icon ? <FontAwesomeIcon icon={icon} /> : null}
                    {' '}
                    {title || null}
                </>
            )}
            size="sm"
            variant="outline-secondary"
        >
            {children}
        </DropdownButton>
    );
}
