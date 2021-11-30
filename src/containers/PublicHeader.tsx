import React from 'react';
import { Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from 'components/Header/LanguageSwitcher';
import { Header } from 'components/Header/Header';
import { useIsFetching } from 'react-query';
import { useClientSideLocaleChange } from 'hooks/common/UserHooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import { HeaderContent } from 'components/Header/HeaderContent';

/**
 * Contains public navigation actions
 */
export function PublicHeader() {
    const { t } = useTranslation();
    const isFetching = useIsFetching();
    const localeSetMutation = useClientSideLocaleChange();

    const setLocale = async (key: string) => {
        await localeSetMutation.mutateAsync(key);
    };

    return (
        <Header showFetchingIndicator={isFetching > 0}>
            <HeaderContent align="end">
                <LanguageSwitcher onChange={setLocale} />
                <LinkContainer to="/">
                    <Nav.Link>
                        <FontAwesomeIcon icon={faSignInAlt} />
                        {' '}
                        {t('login.login')}
                    </Nav.Link>
                </LinkContainer>
            </HeaderContent>
        </Header>
    );
}
