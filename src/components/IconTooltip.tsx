import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type Props = {
    tooltipID: string,
    icon: IconProp,
    text: string,
};

/**
 * Renders an icon that displays a tooltip on hover and click
 * @param tooltipID unique tooltip id is required for the Bootstrap component
 * @param text text to display
 * @param icon FontAwesome icon
 * @constructor
 */
export function IconTooltip({ tooltipID, text, icon }: Props) {
    const tooltip = (
        <Tooltip id={tooltipID}>
            {text}
        </Tooltip>
    );

    return (
        <OverlayTrigger trigger={['hover', 'focus', 'click']} placement="right" overlay={tooltip}>
            <span className="d-inline-block mx-1">
                <FontAwesomeIcon icon={icon} />
            </span>
        </OverlayTrigger>
    );
}
