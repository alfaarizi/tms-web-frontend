import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ResponsiveButtonText, Breakpoint } from 'components/Buttons/ResponsiveButtonText';

type Props = {
    icon: IconProp,
    text: string,
    onClick?: () => void,
    className?: string,
    isLoading?: boolean,
    disabled?: boolean,
    displayTextBreakpoint?: Breakpoint,
}

/**
 * Reusable button component that can be used in ButtonGroups and toolbars
 * @param className Custom className applied to the Bootstrap component
 * @param icon FontAwesome icon
 * @param onClick onClick event handler callback
 * @param text Button text
 * @param displayTextBreakpoint The first viewport size where the button text is visible
 * @param isLoading Show a spinner instead of the icon
 * @param disabled Disable button
 * @constructor
 */
export function ToolbarButton({
    className,
    icon,
    onClick,
    text,
    isLoading,
    disabled,
    displayTextBreakpoint = 'lg',
}: Props) {
    let displayedIcon: JSX.Element;
    if (isLoading) {
        displayedIcon = <Spinner animation="border" size="sm" />;
    } else {
        displayedIcon = <FontAwesomeIcon className="fa-fw" icon={icon} />;
    }

    return (
        <Button
            className={className}
            size="sm"
            variant="outline-secondary"
            onClick={onClick}
            disabled={disabled || isLoading}
            title={text}
        >
            {displayedIcon}
            <ResponsiveButtonText text={text} displayTextBreakpoint={displayTextBreakpoint} />
        </Button>
    );
}
