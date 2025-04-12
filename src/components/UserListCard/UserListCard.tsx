import { ReactNode } from 'react';

import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { User } from '@/resources/common/User';
import { UserListItem } from '@/components/UserListCard/UserListItem';

type Props = {
    title: string,
    users: User[],
    renderUserButtons: (u: User) => ReactNode
}

export function UserListCard({
    title,
    users,
    renderUserButtons,
}: Props) {
    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{title}</CustomCardTitle>
            </CustomCardHeader>

            <div>
                {users.map((user) => <UserListItem key={user.id} user={user} renderUserButtons={renderUserButtons} />)}
            </div>
        </CustomCard>
    );
}
