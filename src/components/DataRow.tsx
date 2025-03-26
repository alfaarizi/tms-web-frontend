import React, { ReactNode } from 'react';
import {
    Col, OverlayTrigger, Row, Tooltip,
} from 'react-bootstrap';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
    label: string;
    children: ReactNode;
    tooltipNode?: ReactNode,
    tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
    tooltipIcon?: IconProp,
    labelWidth?: number,
}

/**
 * Responsive data row component
 * @param label Row label
 * @param children Row content
 * @param tooltip Tooltip text
 * @param tooltipPlacement Tooltip's placement
 * @param tooltipIcon FontAwesome icon
 * @constructor
 */
export function DataRow({
    label,
    children,
    tooltipNode,
    tooltipPlacement = 'right',
    tooltipIcon,
    labelWidth = 2,
}: Props) {
    let iconToolTip: ReactNode | null;

    if (tooltipNode && tooltipIcon) {
        iconToolTip = (
            <OverlayTrigger
                trigger={['hover', 'focus']}
                placement={tooltipPlacement}
                overlay={(
                    <Tooltip id={`tooltip-${label}`}>
                        {tooltipNode}
                    </Tooltip>
                )}
            >
                <span className="d-inline-block mx-1">
                    <FontAwesomeIcon icon={tooltipIcon} />
                </span>
            </OverlayTrigger>
        );
    }

    return (
        <Row>
            <Col md={labelWidth}>
                <strong>
                    {label}
                    {': '}
                    {iconToolTip}
                </strong>
            </Col>
            <Col md={9}>{children}</Col>
        </Row>
    );
}
