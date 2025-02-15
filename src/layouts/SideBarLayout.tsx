import { ReactNode, useEffect } from 'react';
import {
    Button, ButtonGroup, Container, Row, Col,
} from 'react-bootstrap';

import { SideBar } from '@/components/Navigation/SideBar';
import { useShow } from '@/ui-hooks/useShow';
import { useRouteMatch } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faColumns } from '@fortawesome/free-solid-svg-icons';
import styles from '@/layouts/SideBarLayout.module.css';

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
    const contentClasses = `mt-2 ${show && !isExact ? 'd-none' : ''}`;

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
                <Col xs={12} sm={12} md={4} lg={3} xl={2} className="mt-0 ml-0 pl-0 pr-0">
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
                <Col sm={12} md={8} lg={9} xl={10} className={`${contentClasses} ${styles.customMainContentWrapper}`}>
                    <main role="main" className={`${styles.customMainContent}`}>
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
