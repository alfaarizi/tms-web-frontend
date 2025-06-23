import { ReactNode } from 'react';
import { ButtonGroup, DropdownButton } from 'react-bootstrap';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ResponsiveButtonText, Breakpoint } from '@/components/Buttons/ResponsiveButtonText';

type Props = {
    children: ReactNode,
    text: string,
    icon: IconProp,
    disabled?: boolean,
    displayTextBreakpoint?: Breakpoint,
    preventSidebarHide?: boolean,
}

/**
 * Reusable dropdown component that can be used in ButtonGroups and toolbars
 * @param children Dropdown items
 * @param icon FontAwesome icon
 * @param text Button text
 * @param displayTextBreakpoint The first viewport size where the button text is visible
 * @param disabled Disable button
 * @param preventSidebarHide Prevents sidebar from hiding when button is clicked
 * @constructor
 */
export function ToolbarDropdown({
    children,
    icon,
    text,
    disabled,
    displayTextBreakpoint = 'lg',
    preventSidebarHide = false,
}: Props) {
    return (
        <DropdownButton
            as={ButtonGroup}
            disabled={disabled}
            data-prevent-sidebar-hide={preventSidebarHide ? 'true' : 'false'}
            title={(
                <span title={text}>
                    <FontAwesomeIcon className="fa-fw" icon={icon} />
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
