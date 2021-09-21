import React, { ReactNode } from 'react';

type Props = {
    children: ReactNode,
}

export function CustomCardTitle({ children }: Props) {
    return <h5>{children}</h5>;
}
