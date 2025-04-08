import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import styles from 'components/Header/LinkContent.module.css';

type Props = {
    to: string,
    icon: IconProp,
    text: string,
}

export function LinkContent({
    to,
    icon,
    text,
}: Props) {
    return (
        <LinkContainer
            to={to}
            className={styles.linkContainer}
        >
            <Nav.Link>
                <FontAwesomeIcon
                    icon={icon}
                    className={styles.icon}
                />
                {' '}
                {text}
            </Nav.Link>
        </LinkContainer>
    );
}
