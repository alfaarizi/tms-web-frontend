import React from 'react';
import { Navbar, Spinner } from 'react-bootstrap';
import logo from 'assets/logo192.jpg';
import styles from 'components/Header/BrandLogo.module.css';
import { useIsFetching } from 'react-query';

const classes = ['d-inline-block', 'align-top', styles.logo].join(' ');

type Props = {
    showFetchingIndicator: boolean
}

export function BrandLogo({ showFetchingIndicator }: Props) {
    const isFetching = useIsFetching();

    let icon;
    if (showFetchingIndicator && isFetching > 0) {
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
