import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type Props = {
    icon?: IconProp,
    text?: string,
    onClick?: () => void,
    className?: string,
    isLoading?: boolean,
    disabled?: boolean
}

export function ToolbarButton({
    className,
    icon,
    onClick,
    text,
    isLoading,
    disabled,
}: Props) {
    let displayedIcon = null;
    if (isLoading) {
        displayedIcon = <Spinner animation="border" size="sm" />;
    } else if (icon) {
        displayedIcon = <FontAwesomeIcon icon={icon} />;
    }

    return (
        <Button
            className={className}
            size="sm"
            variant="outline-secondary"
            onClick={onClick}
            disabled={disabled || isLoading}
        >
            {displayedIcon}
            {' '}
            {text}
        </Button>
    );
}
