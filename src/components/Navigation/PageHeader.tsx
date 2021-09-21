import React, { ReactNode } from 'react';

type Props = {
    children: ReactNode
}

export function PageHeader({ children }: Props) {
    const classes = `d-flex justify-content-between flex-wrap flex-md-nowrap
        align-items-center pt-3 pb-2 mb-3 border-bottom`;
    return <div className={classes}>{children}</div>;
}
