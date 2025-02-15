import { ReactNode, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import { Variant } from 'react-bootstrap/types';

import { BrandLogo } from '@/components/Header/BrandLogo';
import { AvailableTheme, useGlobalContext } from '@/context/GlobalContext';
import { Role } from '@/resources/common/Role';
import { useMediaQuery } from 'react-responsive';

type Props = {
    children: ReactNode,
    showFetchingIndicator: boolean,
    currentRole: Role,
}

/**
 * Gets the theme based variant of the top header navbar.
 */
function getNavBarVariant(theme: AvailableTheme): Variant {
    let variant: Variant;

    switch (theme) {
    case 'blue':
        variant = 'primary';
        break;
    default:
        variant = 'dark';
    }

    return variant;
}

/**
 * Gets the custom breakpoint for compact navbar mode
 * @param role the role of the user
 */
function getCompactBreakpoint(role: Role): string {
    return {
        admin: 'xl',
        instructor: 'lg',
        student: 'lg',
        default: 'md',
    }[role ?? 'default'];
}

/**
 * A reusable header component for navigation links and other application-wide actions
 * @param children
 * @param showFetchingIndicator show fetching indicator instead of the application icon
 * @param currentRole show the role of the user
 * @constructor
 */
export function Header({ children, showFetchingIndicator, currentRole }: Props) {
    const globalContext = useGlobalContext();
    const [expanded, setExpanded] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 575.98 }); /* sm */

    return (
        <Navbar
            bg={getNavBarVariant(globalContext.theme)}
            variant="dark"
            sticky="top"
            expand="sm"
            expanded={expanded}
            onToggle={setExpanded}
            className={`p-0 compact-${getCompactBreakpoint(currentRole)} ${expanded && isMobile ? 'sidebar-show' : ''}`}
        >
            <BrandLogo showFetchingIndicator={showFetchingIndicator} />
            <Navbar.Toggle aria-controls="navbar-nav" />

            <Navbar.Collapse id="navbar-nav">
                {children}
            </Navbar.Collapse>
        </Navbar>
    );
}
