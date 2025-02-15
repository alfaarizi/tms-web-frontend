import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TranslationTopContent } from '@/i18n/i18n';

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
    const selectedKey = i18n.languages[0];
    const languages = i18n.services.resourceStore.data;

    return (
        <NavDropdown
            title={(
                <>
                    <FontAwesomeIcon icon={faLanguage} />
                    {' '}
                    {(languages[selectedKey]?.translation as TranslationTopContent).autonym}
                </>
            )}
            id="nav-dropdown-role"
            alignRight
        >
            {
                Object.keys(languages).map((key) => (
                    <NavDropdown.Item
                        key={key}
                        active={selectedKey === key}
                        onSelect={() => onChange(key)}
                    >
                        {(languages[key]?.translation as TranslationTopContent).autonym}
                    </NavDropdown.Item>
                ))
            }
        </NavDropdown>
    );
}
