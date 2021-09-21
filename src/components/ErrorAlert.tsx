import React from 'react';
import { Alert } from 'react-bootstrap';

type Props = {
    title: string,
    messages: string[],
    show: boolean
}

export function ErrorAlert({
    title,
    messages,
    show,
}: Props) {
    return (
        <Alert variant="danger" show={show}>
            <p>
                {title}
                :
            </p>
            <ul>
                {/* eslint-disable-next-line react/no-array-index-key */}
                {messages?.map((message, i) => <li key={i}>{message}</li>)}
            </ul>
        </Alert>
    );
}
