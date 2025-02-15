import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/Header/LanguageSwitcher';
import { Header } from '@/components/Header/Header';
import { useIsFetching } from 'react-query';
import { useClientSideLocaleChange } from '@/hooks/common/UserHooks';
import { faBookOpenReader, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { HeaderContent } from '@/components/Header/HeaderContent';
import { NavbarLink } from '@/components/Header/NavbarLink';

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
        <Header showFetchingIndicator={isFetching > 0} currentRole={null}>
            <HeaderContent align="end">
                <NavbarLink
                    to="/about"
                    icon={faBookOpenReader}
                    text={t('aboutPage.about')}
                />
                <LanguageSwitcher onChange={setLocale} />
                <NavbarLink
                    to="/"
                    icon={faSignInAlt}
                    text={t('login.login')}
                />
            </HeaderContent>
        </Header>
    );
}
