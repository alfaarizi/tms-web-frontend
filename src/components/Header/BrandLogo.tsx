import { Navbar, Spinner } from 'react-bootstrap';
import { AvailableTheme, useGlobalContext } from '@/context/GlobalContext';
import styles from '@/components/Header/BrandLogo.module.css';
import logoDark from '@/assets/logo192.png';
import logoBlue from '@/assets/logo192_blue.png';

const classes = ['d-inline-block', 'align-top', styles.logo].join(' ');

type Props = {
    showFetchingIndicator: boolean
}

/**
 * Gets the image URL for the top header branding logo.
 */
function getBrandingLogo(theme: AvailableTheme): string {
    let logo: string;

    switch (theme) {
    case 'blue':
        logo = logoBlue;
        break;
    default:
        logo = logoDark;
    }
    return logo;
}

/**
 * Shows application logo or fetching indicator
 * @param showFetchingIndicator show fetching indicator instead of the application icon
 * @constructor
 */
export function BrandLogo({ showFetchingIndicator }: Props) {
    const globalContext = useGlobalContext();

    let icon;
    if (showFetchingIndicator) {
        icon = (
            <Spinner
                size="sm"
                animation="border"
                variant="light"
                className={classes}
            />
        );
    } else {
        icon = (
            <img
                src={getBrandingLogo(globalContext.theme)}
                className={classes}
                alt="TMS Logo"
            />
        );
    }

    return (
        <Navbar.Brand className="mx-2">
            {icon}
            {' '}
            TMS
        </Navbar.Brand>
    );
}
