import React, { ReactNode } from 'react';
import { Navbar } from 'react-bootstrap';
import { Variant } from 'react-bootstrap/types';

import { BrandLogo } from 'components/Header/BrandLogo';
import { AvailableTheme, useGlobalContext } from 'context/GlobalContext';

type Props = {
    children: ReactNode,
    showFetchingIndicator: boolean
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
 * A reusable header component for navigation links and other application-wide actions
 * @param children
 * @param showFetchingIndicator show fetching indicator instead of the application icon
 * @constructor
 */
export function Header({ children, showFetchingIndicator }: Props) {
    const globalContext = useGlobalContext();
    return (
        <Navbar bg={getNavBarVariant(globalContext.theme)} variant="dark" sticky="top" className="p-0" expand="md">
            <BrandLogo showFetchingIndicator={showFetchingIndicator} />
            <Navbar.Toggle aria-controls="navbar-nav" />

            <Navbar.Collapse id="navbar-nav">
                {children}
            </Navbar.Collapse>
        </Navbar>
    );
}
