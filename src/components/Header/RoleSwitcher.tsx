import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBriefcase, faWrench } from '@fortawesome/free-solid-svg-icons';
import { NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { Role } from '@/resources/common/Role';

type Props = {
    isStudent: boolean,
    isFaculty: boolean
    isAdmin: boolean,
    currentRole: Role,
    switchRole: (role: Role) => void,
}

const studentIcon = <FontAwesomeIcon icon={faGraduationCap} />;
const instructorIcon = <FontAwesomeIcon icon={faBriefcase} />;
const adminIcon = <FontAwesomeIcon icon={faWrench} />;

/**
 * Renders a dropdown component with the available roles
 * @param isAdmin is admin role available
 * @param isFaculty is faculty/instructor role available
 * @param isStudent is student role available
 * @param currentRole the currently selected role
 * @param switchRole handle role switch
 * @constructor
 */
export function RoleSwitcher({
    isAdmin,
    isFaculty,
    isStudent,
    currentRole,
    switchRole,
}: Props) {
    const { t } = useTranslation();

    let title;
    switch (currentRole) {
    case 'student':
        title = (
            <>
                {studentIcon}
                {' '}
                {t('navbar.roles.student')}
            </>
        );
        break;
    case 'instructor':
        title = (
            <>
                {instructorIcon}
                {' '}
                {t('navbar.roles.instructor')}
            </>
        );
        break;
    case 'admin':
        title = (
            <>
                {adminIcon}
                {' '}
                {t('navbar.roles.admin')}
            </>
        );
        break;
    default:
        break;
    }

    return (
        <NavDropdown title={title} id="nav-dropdown-role">
            {isStudent
                ? (
                    <NavDropdown.Item onClick={() => switchRole('student')}>
                        {studentIcon}
                        {' '}
                        {t('navbar.roles.student')}
                    </NavDropdown.Item>
                )
                : null}
            {isFaculty
                ? (
                    <NavDropdown.Item onClick={() => switchRole('instructor')}>
                        {instructorIcon}
                        {' '}
                        {t('navbar.roles.instructor')}
                    </NavDropdown.Item>
                )
                : null}
            {isAdmin
                ? (
                    <NavDropdown.Item onClick={() => switchRole('admin')}>
                        {adminIcon}
                        {' '}
                        {t('navbar.roles.admin')}
                    </NavDropdown.Item>
                )
                : null}
        </NavDropdown>
    );
}
