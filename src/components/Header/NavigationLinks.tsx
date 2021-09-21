import React from 'react';
import { Route, Switch } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendar, faCrosshairs, faFile, faList, faPen,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

export function NavigationLinks() {
    const { t } = useTranslation();

    return (
        <Switch>
            <Route path="/student">
                <LinkContainer to="/student/task-manager">
                    <Nav.Link>
                        <FontAwesomeIcon icon={faFile} />
                        {' '}
                        {t('navbar.taskmanager')}
                    </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/student/exam">
                    <Nav.Link>
                        <FontAwesomeIcon icon={faPen} />
                        {' '}
                        {t('navbar.exam')}
                    </Nav.Link>
                </LinkContainer>
            </Route>
            <Route path="/instructor">
                <LinkContainer to="/instructor/task-manager">
                    <Nav.Link>
                        <FontAwesomeIcon icon={faFile} />
                        {' '}
                        {t('navbar.taskmanager')}
                    </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/instructor/plagiarism">
                    <Nav.Link>
                        <FontAwesomeIcon icon={faCrosshairs} />
                        {' '}
                        {t('navbar.plagiarism')}
                    </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/instructor/exam">
                    <Nav.Link>
                        <FontAwesomeIcon icon={faPen} />
                        {' '}
                        {t('navbar.exam')}
                    </Nav.Link>
                </LinkContainer>
            </Route>
            <Route path="/admin">
                <LinkContainer to="/admin/course-manager">
                    <Nav.Link>
                        <FontAwesomeIcon icon={faList} />
                        {' '}
                        {t('course.courses')}
                    </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin/semester-manager">
                    <Nav.Link>
                        <FontAwesomeIcon icon={faCalendar} />
                        {' '}
                        {t('navbar.semesterManager')}
                    </Nav.Link>
                </LinkContainer>
            </Route>
        </Switch>
    );
}
