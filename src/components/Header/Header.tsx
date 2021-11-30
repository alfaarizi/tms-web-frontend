import React, { ReactNode } from 'react';
import { Navbar } from 'react-bootstrap';

import { BrandLogo } from 'components/Header/BrandLogo';

type Props = {
    children: ReactNode,
    showFetchingIndicator: boolean
}

/**
 * A reusable header component for navigation links and other application-wide actions
 * @param children
 * @param showFetchingIndicator show fetching indicator instead of the application icon
 * @constructor
 */
export function Header({ children, showFetchingIndicator }: Props) {
    return (
        <Navbar bg="dark" variant="dark" sticky="top" className="p-0" expand="md">
            <BrandLogo showFetchingIndicator={showFetchingIndicator} />
            <Navbar.Toggle aria-controls="navbar-nav" />

            <Navbar.Collapse id="navbar-nav">
                {children}
            </Navbar.Collapse>
        </Navbar>
    );
}
