import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { languages } from 'i18n/i18n';

type Props = {
    onChange: (key: string) => void
}

/**
 * Renders a dropdown component with the available languages
 * @param onChange handle language switch
 * @constructor
 */
export function LanguageSwitcher({ onChange }: Props) {
    const { i18n } = useTranslation();
    const selectedKey = i18n.language;

    return (
        <NavDropdown
            title={(
                <>
                    <FontAwesomeIcon icon={faLanguage} />
                    {' '}
                    {languages[selectedKey].name}
                </>
            )}
            id="nav-dropdown-role"
        >
            {
                Object.keys(languages).map((key) => (
                    <NavDropdown.Item
                        key={key}
                        active={selectedKey === key}
                        onSelect={() => onChange(key)}
                    >
                        {languages[key].name}
                    </NavDropdown.Item>
                ))
            }
        </NavDropdown>
    );
}
