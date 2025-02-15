import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '@/components/ExpadanbleSection/ExpandableSection.module.css';

type Props = {
    header: JSX.Element,
    content: JSX.Element,
    show: boolean,
    onToggle: () => void
}

export function ExpandableSection({
    header, content, show, onToggle,
}: Props) {
    return (
        <>
            <div
                className={`d-flex pb-2 mb-3 justify-content-between flex-wrap flex-md-nowrap ${styles.boxStyle}`}
                onClick={onToggle}
            >
                <h5 className="p-0 m-0">{header}</h5>
                <FontAwesomeIcon icon={show ? faChevronUp : faChevronDown} />
            </div>
            <div className={show ? '' : 'd-none'}>
                {content}
            </div>
        </>
    );
}
