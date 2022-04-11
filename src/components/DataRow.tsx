import React, { ReactNode } from 'react';
import { Col, Row } from 'react-bootstrap';

type Props = {
    label: string;
    children: ReactNode;
}

/**
 * Responsive data row component
 * @param label Row label
 * @param children Row content
 * @constructor
 */
export function DataRow({
    label,
    children,
}: Props) {
    return (
        <Row>
            <Col md={3}>
                <strong>
                    {label}
                    {': '}
                </strong>
            </Col>
            <Col md={9}>{children}</Col>
        </Row>
    );
}
