import { ReactNode, useEffect, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import { Variant } from 'react-bootstrap/types';

import { BrandLogo } from '@/components/Header/BrandLogo';
import { AvailableTheme, useGlobalContext } from '@/context/GlobalContext';

type Props = {
    children: ReactNode,
    showFetchingIndicator: boolean,
    currentRole: 'admin' | 'student' | 'instructor' | null,
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
 * @param currentRole show the role of the user
 * @constructor
 */
export function Header({ children, showFetchingIndicator, currentRole }: Props) {
    const globalContext = useGlobalContext();
    const [expand, setExpand] = useState(false);

    useEffect(() => {
        const roleMinWidths: Record<string, number> = {
            admin: 965, student: 770, instructor: 850, null: 768,
        };
        const handleResize = () => setExpand(
            window.innerWidth >= roleMinWidths[currentRole || 'null'],
        );
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentRole]);

    return (
        <Navbar
            bg={getNavBarVariant(globalContext.theme)}
            variant="dark"
            sticky="top"
            className="p-0"
            expand={expand}
        >
            <BrandLogo showFetchingIndicator={showFetchingIndicator} />
            <Navbar.Toggle aria-controls="navbar-nav" />

            <Navbar.Collapse id="navbar-nav">
                {children}
            </Navbar.Collapse>
        </Navbar>
    );
}
