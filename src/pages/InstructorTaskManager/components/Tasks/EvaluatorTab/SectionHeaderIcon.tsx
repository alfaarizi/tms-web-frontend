import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

type Props = {
    icon: IconProp,
    active?: boolean,
    flip?: 'horizontal' | 'vertical' | 'both'
}

export function SectionHeaderIcon({ icon, active = false, flip }: Props) {
    return (
        <span className="fa-layers fa-fw">
            {flip ? <FontAwesomeIcon icon={icon} flip={flip} /> : <FontAwesomeIcon icon={icon} />}
            {active
                ? <FontAwesomeIcon icon={faCheckCircle} transform="shrink-6 right-8 down-7" color="green" />
                : null}
        </span>
    );
}
