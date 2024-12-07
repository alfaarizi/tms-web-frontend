import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import styles from 'components/Navigation/SideBarItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

type Props = {
    title: string,
    children?: ReactNode,
    to: string
    isCanvasSync?: false | true
}

export function SideBarItem({
    title,
    children,
    to,
    isCanvasSync = false,
}: Props) {
    return (
        <NavLink
            to={to}
            className="border-bottom border-secondary d-block text-decoration-none text-dark"
            activeClassName={styles.sideBarItemActive}
        >
            <strong>{title}</strong>
            {isCanvasSync ? (
                <span>
                    {' '}
                    <FontAwesomeIcon icon={faSync} />
                </span>
            ) : null }
            {children}
        </NavLink>
    );
}
