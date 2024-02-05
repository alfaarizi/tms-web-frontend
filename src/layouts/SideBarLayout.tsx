import React, { ReactNode, useEffect } from 'react';
import {
    Button, ButtonGroup, Container, Row, Col,
} from 'react-bootstrap';

import { SideBar } from 'components/Navigation/SideBar';
import { useShow } from 'ui-hooks/useShow';
import { useRouteMatch } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faColumns } from '@fortawesome/free-solid-svg-icons';

type Props = {
    sidebarTitle: string,
    sidebarButtons?: ReactNode,
    mainContent: ReactNode,
    sidebarItems: JSX.Element[],
}

export function SideBarLayout({
    mainContent,
    sidebarButtons,
    sidebarItems,
    sidebarTitle,
}: Props) {
    const {
        show,
        toShow,
        toHide,
    } = useShow();
    const { isExact } = useRouteMatch();

    useEffect(() => {
        if (isExact) {
            toShow();
        } else {
            toHide();
        }
    }, [isExact]);

    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col md={2} xs={12} className="mt-0 ml-0 pl-0 pr-0">
                    <SideBar show={show}>
                        <div className="pb-1 border-secondary border-bottom">
                            <h4>{sidebarTitle}</h4>
                            {sidebarButtons
                                ? (
                                    <ButtonGroup onClick={toHide}>
                                        {sidebarButtons || null}
                                    </ButtonGroup>
                                )
                                : null}
                        </div>
                        {sidebarItems.map((item) => <div key={item.key} onClick={toHide}>{item}</div>)}
                    </SideBar>
                </Col>
                <Col md={9} lg={10} className="ml-sm-auto mt-2 pl-5">
                    <main role="main">
                        <Button onClick={toShow} className="d-md-none">
                            <FontAwesomeIcon icon={faColumns} />
                            {' '}
                            {sidebarTitle}
                        </Button>

                        {mainContent}
                    </main>
                </Col>
            </Row>
        </Container>
    );
}
