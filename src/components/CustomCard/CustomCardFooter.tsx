import React, { ReactNode } from 'react';

type Props = {
    children: ReactNode,
}

export function CustomCardFooter({ children }: Props) {
    return (
        <div className={`d-flex justify-content-between flex-wrap flex-md-nowrap 
        border-top pt-2 mt-2`}
        >
            {children}
        </div>
    );
}
