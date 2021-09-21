import React, { ReactNode } from 'react';
import styles from 'components/Navigation/SideBar.module.css';

type Props = {
    show: boolean,
    children: ReactNode,
}

export function SideBar({
    show,
    children,
}: Props) {
    const classes = ['col-md-3', 'col-lg-2', 'd-md-block', styles.sidebar, 'collapse'];
    if (show) {
        classes.push('show');
    }

    return (
        <nav id="sidebarMenu" className={classes.join(' ')}>
            <div className={styles.sidebarSticky}>
                {children}
            </div>
        </nav>
    );
}
