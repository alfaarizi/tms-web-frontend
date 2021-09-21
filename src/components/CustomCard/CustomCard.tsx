import React, { ReactNode } from 'react';

type Props = {
    children: ReactNode
}

export function CustomCard({ children }: Props) {
    return (
        <div className="my-3 p-3 bg-white rounded shadow-sm border">
            {children}
        </div>
    );
}
