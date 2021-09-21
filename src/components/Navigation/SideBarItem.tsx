import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import styles from 'components/Navigation/SideBarItem.module.css';

type Props = {
    title: string,
    children?: ReactNode,
    to: string
}

export function SideBarItem({
    title,
    children,
    to,
}: Props) {
    return (
        <NavLink
            to={to}
            className="border-bottom border-secondary d-block text-decoration-none text-dark"
            activeClassName={styles.sideBarItemActive}
        >
            <strong>{title}</strong>
            {children}
        </NavLink>
    );
}
