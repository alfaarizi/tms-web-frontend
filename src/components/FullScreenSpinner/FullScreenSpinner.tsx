import React from 'react';
import { Spinner } from 'react-bootstrap';

import styles from 'components/FullScreenSpinner/FullScreenSpinner.module.css';

export function FullScreenSpinner() {
    return (
        <div className={styles.fullScreenSpinner}>
            <Spinner animation="border" />
        </div>
    );
}
