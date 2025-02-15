import { ReactNode } from 'react';
import styles from '@/components/Navigation/SideBar.module.css';

type Props = {
    show: boolean,
    children: ReactNode,
}

export function SideBar({
    show,
    children,
}: Props) {
    const classes = ['d-md-block', styles.sidebar, 'collapse', 'h-100'];
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
