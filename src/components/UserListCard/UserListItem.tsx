import React, { ReactNode } from 'react';
import { User } from 'resources/common/User';
import { ButtonGroup } from 'react-bootstrap';
import { ListCardItem } from 'components/ListCardItem/ListCardItem';

type Props = {
    user: User,
    renderUserButtons: (u: User) => ReactNode
}

export function UserListItem({
    user,
    renderUserButtons,
}: Props) {
    return (
        <ListCardItem className="d-flex justify-content-between">
            <span>
                <strong>{user.name}</strong>
                {` (${user.neptun})`}
            </span>
            <ButtonGroup>
                {renderUserButtons(user)}
            </ButtonGroup>
        </ListCardItem>
    );
}
