import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { MockLogin } from 'resources/common/MockLogin';
import { useTranslation } from 'react-i18next';
import {
    generateAdminUsers,
    generateStudentUsers,
    generateInstructorUsers,
} from 'pages/Login/components/MockLoginDefaultUsers';

type Props = {
    onLogin : (data: MockLogin) => void,
    isLoading: boolean,
}

export function DefaultUserLogin({ onLogin, isLoading } : Props) {
    const { t } = useTranslation();
    return (
        <Container>
            {
                [
                [generateStudentUsers(6), 'login.mockUsers.student'] as const,
                [generateInstructorUsers(3), 'login.mockUsers.instructor'] as const,
                [generateAdminUsers(1), 'login.mockUsers.admin'] as const,
                ].map(([users, msg]) => (
                    <Row className="pt-sm-2" key={msg}>
                        {users.map((user, index) => (
                            <ToolbarButton
                                className="m-1"
                                icon={faSignInAlt}
                                text={t(msg, { number: index + 1 })}
                                onClick={() => onLogin(user)}
                                key={user.userCode}
                                displayTextBreakpoint="xs"
                                disabled={isLoading}
                            />
                        ))}
                    </Row>
                ))
            }
        </Container>
    );
}
