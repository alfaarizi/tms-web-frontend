import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import styles from '@/components/Navigation/SideBarItemWithIcon.module.css';

type Props = {
    icon: IconProp
    title: string,
    to: string
}

export function SideBarItemWithIcon({
    title,
    icon,
    to,
}: Props) {
    return (
        <NavLink
            to={to}
            className={`d-block text-decoration-none text-dark my-2 ${styles.sidebarItemWithIcon}`}
            activeClassName="font-weight-bold"
        >
            <FontAwesomeIcon icon={icon} />
            {' '}
            <span>{title}</span>
        </NavLink>
    );
}
