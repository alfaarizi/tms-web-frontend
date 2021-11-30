import React, { ReactNode } from 'react';
import { Nav } from 'react-bootstrap';

type Props = {
    children: ReactNode,
    align: 'start' | 'end',
}

/**
 * Contains header links, buttons, dropdowns
 * @param align
 * @param children
 * @constructor
 */
export function HeaderContent({ align, children }: Props) {
    const classNames = align === 'start' ? 'ml-2' : 'ml-auto ml-2';
    return <Nav className={classNames}>{children}</Nav>;
}
