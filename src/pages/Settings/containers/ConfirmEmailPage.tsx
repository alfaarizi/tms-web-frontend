import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import i18next from 'i18next';

import { useClientSideLocaleChange, useConfirmEmailMutation } from 'hooks/common/UserHooks';
import { SingleColumnLayout } from 'layouts/SingleColumnLayout';
import { FullScreenSpinner } from 'components/FullScreenSpinner/FullScreenSpinner';
import { LanguageSwitcher } from 'components/Header/LanguageSwitcher';
import { BrandLogo } from 'components/Header/BrandLogo';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardFooter } from 'components/CustomCard/CustomCardFooter';
import { useBranding } from 'ui-hooks/useBranding';

enum ConfirmationState { BeforeSend, Sending, SuccessSameUser, SuccessDifferentUser, Failed }

type Params = {
    code?: string
}

type Props = {
    loggedIn: boolean | null;
}

export default function ConfirmEmailPage({
    loggedIn,
}: Props) {
    const { t } = useTranslation();
    const { code } = useParams<Params>();
    const [state, setState] = useState(ConfirmationState.BeforeSend);
    const confirmEmailMutation = useConfirmEmailMutation();
    const clientSideLocaleChange = useClientSideLocaleChange();
    const branding = useBranding();

    if (!code) {
        return null;
    }

    const handleLocaleChange = async (locale: string) => {
        await clientSideLocaleChange.mutateAsync(locale);
    };

    if (state === ConfirmationState.BeforeSend && loggedIn !== null) {
        confirmEmailMutation.mutateAsync(code).then(
            ({ currentUser }) => setState(ConfirmationState[currentUser ? 'SuccessSameUser' : 'SuccessDifferentUser']),
            () => setState(ConfirmationState.Failed),
        );
        setState(ConfirmationState.Sending);
    }
    let text: JSX.Element | undefined;
    switch (state) {
    case ConfirmationState.SuccessSameUser:
        text = (
            <>
                <p>{t('confirmEmail.success')}</p>
                <p>
                    <Trans i18nKey="confirmEmail.openSettings" components={{ settings: <Link to="/settings" /> }} />
                </p>
            </>
        );
        break;
    case ConfirmationState.SuccessDifferentUser:
        text = (
            <>
                <p>{t('confirmEmail.success')}</p>
                <p>
                    {
                        loggedIn
                            // eslint-disable-next-line max-len
                            ? <Trans i18nKey="confirmEmail.differentUser" components={{ logout: <Link to="/logout" /> }} />
                            : <Trans i18nKey="confirmEmail.logIn" components={{ login: <Link to="/" /> }} />
                    }
                </p>
            </>
        );
        break;
    case ConfirmationState.Failed:
        text = <p>{t('confirmEmail.failed')}</p>;
        break;
    default:
    }
    if (text) {
        return (
            <SingleColumnLayout>
                <Row className="justify-content-md-center mt-4">
                    <Col md={6}>
                        <CustomCard>
                            <CustomCardHeader>
                                <BrandLogo showFetchingIndicator={false} />
                                {loggedIn ? null : <LanguageSwitcher onChange={handleLocaleChange} />}
                            </CustomCardHeader>
                            <Card.Body>
                                {text}
                            </Card.Body>
                            <CustomCardFooter>
                                <div>{branding.organizationName[i18next.language]}</div>
                                <a href="https://tms-elte.gitlab.io/">
                                    TMS v
                                    {process.env.REACT_APP_VERSION}
                                </a>
                            </CustomCardFooter>
                        </CustomCard>
                    </Col>
                </Row>
            </SingleColumnLayout>
        );
    }
    return <FullScreenSpinner />;
}
