import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

import styles from '@/components/CodeChecker/SeverityDisplay/SeverityDisplay.module.css';

type Props = {
    severity: string;
    translatedSeverity: string;
}

export function SeverityDisplay({ severity, translatedSeverity }: Props) {
    const severityIconClassNames = [
        styles[severity.toLowerCase()],
        'mr-1',
    ].join(' ');

    return (
        <>
            <FontAwesomeIcon icon={faSquare} size="lg" className={severityIconClassNames} />
            {translatedSeverity}
        </>
    );
}
