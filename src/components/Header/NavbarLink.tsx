import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import styles from '@/components/Header/NavbarLink.module.css';

type Props = {
    to: string,
    icon: IconProp,
    text: string,
}

export function NavbarLink({
    to,
    icon,
    text,
}: Props) {
    return (
        <LinkContainer to={to}>
            <Nav.Link className={styles.navLink}>
                <FontAwesomeIcon
                    icon={icon}
                    className={styles.icon}
                />
                <span className={styles.text}>{text}</span>
            </Nav.Link>
        </LinkContainer>
    );
}
