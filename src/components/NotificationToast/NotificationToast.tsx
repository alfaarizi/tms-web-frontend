import { NotificationData } from '@/context/GlobalContext';
import { Toast } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import styles from '@/components/NotificationToast/NotificationToast.module.css';
import { useTranslation } from 'react-i18next';

type Props = {
    data: NotificationData | null,
    onClose: () => void
}

export function NotificationToast({
    data,
    onClose,
}: Props) {
    const { t } = useTranslation();

    let icon;
    let iconClass;
    let title;
    switch (data?.variant) {
    case 'error':
        icon = faTimesCircle;
        iconClass = 'text-danger';
        title = t('common.error');
        break;
    case 'success':
        icon = faCheckCircle;
        iconClass = 'text-success';
        title = t('common.success');
        break;
    case 'info':
        icon = faInfoCircle;
        iconClass = 'text-primary';
        title = t('common.information');
        break;
    default:
        icon = faInfoCircle;
        iconClass = '';
        title = '';
        break;
    }

    return (
        <div className={styles.notificationContainer}>
            <Toast show={data !== null} onClose={onClose} delay={10000} autohide>
                <Toast.Header>
                    <strong className="mr-auto">
                        <FontAwesomeIcon className={iconClass} icon={icon} />
                        {' '}
                        {title}
                    </strong>
                </Toast.Header>
                <Toast.Body>{data?.message}</Toast.Body>
            </Toast>
        </div>
    );
}
