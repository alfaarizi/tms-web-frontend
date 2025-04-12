import { ReactNode } from 'react';

type Props = {
    children: ReactNode,
}

export function CustomCardHeader({ children }: Props) {
    return (
        <div className={`d-flex justify-content-between flex-wrap flex-md-nowrap
         align-items-center pb-2 mb-2 border-bottom`}
        >
            {children}
        </div>
    );
}
