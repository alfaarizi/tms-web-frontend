import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { LinkContainer } from 'react-router-bootstrap';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SemesterSwitcher } from 'components/Header/SemesterSwitcher';
import { LanguageSwitcher } from 'components/Header/LanguageSwitcher';
import { RoleSwitcher } from 'components/Header/RoleSwitcher';
import { BrandLogo } from 'components/Header/BrandLogo';
import { NavigationLinks } from 'components/Header/NavigationLinks';
import { Semester } from 'resources/common/Semester';
import { UserInfo } from 'resources/common/UserInfo';

type Props = {
    semesters: Semester[] | undefined,
    fetchSemesters: () => void,
    selectedSemester: Semester | null,
    setSelectedSemester: (semester: Semester) => void,
    userInfo: UserInfo,
    setLocale: (key: string) => void
}

export function Header({
    selectedSemester,
    semesters,
    setLocale,
    fetchSemesters,
    setSelectedSemester,
    userInfo,
}: Props) {
    const { t } = useTranslation();

    return (
        <Navbar bg="dark" variant="dark" sticky="top" className="p-0" expand="md">
            <BrandLogo showFetchingIndicator />

            <Navbar.Toggle aria-controls="navbar-nav" />

            <Navbar.Collapse id="navbar-nav">
                <Nav className="mr-auto ml-2">
                    <RoleSwitcher
                        isStudent={userInfo.isStudent}
                        isFaculty={userInfo.isFaculty}
                        isAdmin={userInfo.isAdmin}
                    />

                    <NavigationLinks />
                </Nav>

                <Nav className="ml-2">
                    <SemesterSwitcher
                        semesters={semesters}
                        selected={selectedSemester}
                        onChange={setSelectedSemester}
                        onRefetch={fetchSemesters}
                    />

                    <LanguageSwitcher onChange={setLocale} />

                    <LinkContainer to="/logout">
                        <Nav.Link>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            {' '}
                            {t('navbar.logout', { neptun: userInfo.neptun })}
                        </Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
