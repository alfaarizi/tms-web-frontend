import React, { ChangeEvent } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { User } from 'resources/common/User';
import { ToolbarButton } from './Buttons/ToolbarButton';

type Props = {
    users: User[],
    onChange: (userID: number) => void,
    selectedID: number
}

export function UserSwitcher({
    onChange,
    selectedID,
    users,
}: Props) {
    const userIdx = users.findIndex((student) => student.id === selectedID);
    const { length } = users;

    const handleNext = () => {
        const nextStudent: User = userIdx < length - 1 ? users[userIdx + 1] : users[0];
        onChange(nextStudent.id);
    };

    const handlePrev = () => {
        const prevStudent: User = userIdx > 0 ? users[userIdx - 1] : users[length - 1];
        onChange(prevStudent.id);
    };

    const handleSelectChange = (evt: ChangeEvent<HTMLInputElement>) => {
        const userID = parseInt(evt.target.value, 10);
        onChange(userID);
    };

    return (
        <Form className="my-1">
            <Form.Group controlId="user-switcher">
                <InputGroup>
                    <InputGroup.Prepend>
                        <ToolbarButton onClick={handlePrev} icon={faArrowLeft} />
                    </InputGroup.Prepend>
                    <Form.Control as="select" value={users[userIdx].id} onChange={handleSelectChange} custom>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name}
                                {' '}
                                (
                                {u.neptun}
                                )
                            </option>
                        ))}
                    </Form.Control>
                    <InputGroup.Append>
                        <ToolbarButton onClick={handleNext} icon={faArrowRight} />
                    </InputGroup.Append>
                </InputGroup>
            </Form.Group>
        </Form>
    );
}
