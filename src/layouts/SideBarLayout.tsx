import React, { ReactNode, useEffect } from 'react';
import {
    Button, ButtonGroup, Container, Row,
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
        <Container fluid={false} className="mt-3">
            <Row>
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

                <main role="main" className="col-md-9 ml-sm-auto col-lg-10">
                    <Button onClick={toShow} className="d-md-none">
                        <FontAwesomeIcon icon={faColumns} />
                        {' '}
                        {sidebarTitle}
                    </Button>

                    {mainContent}
                </main>
            </Row>
        </Container>
    );
}
