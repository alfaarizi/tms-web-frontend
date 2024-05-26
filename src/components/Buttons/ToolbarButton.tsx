import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ResponsiveButtonText, Breakpoint } from 'components/Buttons/ResponsiveButtonText';

type Props = {
    icon: IconProp,
    flip?: 'horizontal' | 'vertical' | 'both',
    text: string,
    onClick?: () => void,
    href?: string,
    target?: string,
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
 * @param href URL the button should link to; if provided, the button will be an `<a>`
 *  element instead of a `<button>`
 * @param target `target` attribute if the button is rendered as an `<a>` element
 * @param text Button text
 * @param displayTextBreakpoint The first viewport size where the button text is visible
 * @param isLoading Show a spinner instead of the icon
 * @param disabled Disable button
 * @constructor
 */
export function ToolbarButton({
    className,
    icon,
    flip,
    onClick,
    href,
    target,
    text,
    isLoading,
    disabled,
    displayTextBreakpoint = 'lg',
}: Props) {
    let displayedIcon: JSX.Element;
    if (isLoading) {
        displayedIcon = <Spinner animation="border" size="sm" />;
    } else {
        displayedIcon = <FontAwesomeIcon className="fa-fw" icon={icon} flip={flip} />;
    }

    return (
        <Button
            className={className}
            size="sm"
            variant="outline-secondary"
            onClick={onClick}
            href={href}
            target={target}
            disabled={disabled || isLoading}
            title={text}
        >
            {displayedIcon}
            <ResponsiveButtonText text={text} displayTextBreakpoint={displayTextBreakpoint} />
        </Button>
    );
}
