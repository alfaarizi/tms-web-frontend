import React, { ReactNode } from 'react';
import { ButtonGroup, DropdownButton } from 'react-bootstrap';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ResponsiveButtonText, Breakpoint } from 'components/Buttons/ResponsiveButtonText';

type Props = {
    children: ReactNode,
    text: string,
    icon: IconProp,
    disabled?: boolean,
    displayTextBreakpoint?: Breakpoint,
}

/**
 * Reusable dropdown component that can be used in ButtonGroups and toolbars
 * @param children Dropdown items
 * @param icon FontAwesome icon
 * @param text Button text
 * @param displayTextBreakpoint The first viewport size where the button text is visible
 * @param disabled Disable button
 * @constructor
 */
export function ToolbarDropdown({
    children,
    icon,
    text,
    disabled,
    displayTextBreakpoint = 'lg',
}: Props) {
    return (
        <DropdownButton
            as={ButtonGroup}
            disabled={disabled}
            title={(
                <span title={text}>
                    <FontAwesomeIcon icon={icon} />
                    <ResponsiveButtonText text={text} displayTextBreakpoint={displayTextBreakpoint} />
                </span>
            )}
            size="sm"
            variant="outline-secondary"
        >
            {children}
        </DropdownButton>
    );
}
