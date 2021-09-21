import React, { ReactNode } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from 'components/Header/LanguageSwitcher';
import { BrandLogo } from 'components/Header/BrandLogo';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardFooter } from 'components/CustomCard/CustomCardFooter';

type Props = {
    children: ReactNode,
    onLocaleChange: (locale: string) => void
}

export function LoginCard({
    children,
    onLocaleChange,
}: Props) {
    const { t } = useTranslation();
    return (
        <Row className="justify-content-md-center mt-4">
            <Col md={6}>
                <CustomCard>
                    <CustomCardHeader>
                        <BrandLogo showFetchingIndicator={false} />
                        <LanguageSwitcher onChange={onLocaleChange} />
                    </CustomCardHeader>
                    <Card.Body>
                        {children}
                    </Card.Body>
                    <CustomCardFooter>
                        {t('common.elteFI')}
                    </CustomCardFooter>
                </CustomCard>
            </Col>
        </Row>
    );
}
