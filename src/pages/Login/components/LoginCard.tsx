import React, { ReactNode } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardFooter } from 'components/CustomCard/CustomCardFooter';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { useBranding } from 'ui-hooks/useBranding';

type Props = {
    children: ReactNode
}

export function LoginCard({ children }: Props) {
    const { t } = useTranslation();
    const branding = useBranding();

    return (
        <Row className="justify-content-md-center mt-4">
            <Col md={6}>
                <CustomCard>
                    <CustomCardHeader>
                        <CustomCardTitle>{t('login.login')}</CustomCardTitle>
                    </CustomCardHeader>
                    <Card.Body>
                        {children}
                    </Card.Body>
                    <CustomCardFooter>
                        <div>{branding.organizationName[i18next.language]}</div>
                        <a href="https://gitlab.com/tms-elte">
                            TMS v
                            {process.env.REACT_APP_VERSION}
                        </a>
                    </CustomCardFooter>
                </CustomCard>
            </Col>
        </Row>
    );
}
