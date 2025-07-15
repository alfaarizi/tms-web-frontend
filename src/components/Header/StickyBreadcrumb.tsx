import { Breadcrumb } from 'react-bootstrap';
import { ReactNode } from 'react';
import styles from '@/components/Header/StickyBreadcrumb.module.css';

type Props = {
    children: ReactNode
}

const classes = [styles.breadcrumbsTop, 'sticky-top'].join(' ');

export function StickyBreadcrumb({ children }:Props) {
    return (
        <Breadcrumb className={classes}>
            {children}
        </Breadcrumb>
    );
}
