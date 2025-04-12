import { Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

type Props = {
    isLoading: boolean
}

/**
 * Reusable login button component
 * @param isLoading
 * @constructor
 */
export function LoginButton({ isLoading }: Props) {
    const { t } = useTranslation();
    return (
        <Button variant="primary" type="submit" disabled={isLoading} block>
            {isLoading ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faSignInAlt} />}
            {' '}
            {t('login.login')}
        </Button>
    );
}
