import { ReactNode } from 'react';
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
    const classNames = align === 'start' ? 'pl-2' : 'pl-2 ml-auto ';
    return <Nav className={classNames}>{children}</Nav>;
}
