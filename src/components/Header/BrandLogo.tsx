import React from 'react';
import { Navbar, Spinner } from 'react-bootstrap';
import logo from 'assets/logo192.jpg';
import styles from 'components/Header/BrandLogo.module.css';

const classes = ['d-inline-block', 'align-top', styles.logo].join(' ');

type Props = {
    showFetchingIndicator: boolean
}

/**
 * Shows application logo or fetching indicator
 * @param showFetchingIndicator show fetching indicator instead of the application icon
 * @constructor
 */
export function BrandLogo({ showFetchingIndicator }: Props) {
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
                src={logo}
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
