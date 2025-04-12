import { ReactNode } from 'react';
import { Container } from 'react-bootstrap';

type Props = {
    children: ReactNode
}

export function SingleColumnLayout({ children }: Props) {
    return (
        <Container className="mt-3">
            <main role="main">
                {children}
            </main>
        </Container>
    );
}
