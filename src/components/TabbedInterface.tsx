import React, { ReactNode } from 'react';
import { Tabs } from 'react-bootstrap';

type Props = {
    id: string,
    defaultActiveKey: string,
    children: ReactNode
}

export function TabbedInterface({
    children,
    defaultActiveKey,
    id,
}: Props) {
    return (
        <Tabs defaultActiveKey={defaultActiveKey} id={id} mountOnEnter variant="pills" fill>
            {children}
        </Tabs>
    );
}
