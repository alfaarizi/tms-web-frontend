import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormError } from '@/components/FormError';
import { MockLogin } from '@/resources/common/MockLogin';
import { LoginProps } from '@/pages/Login/components/LoginProps';
import { LoginButton } from '@/pages/Login/components/LoginButton';
import { useServersideFormErrors } from '@/ui-hooks/useServersideFormErrors';
import { useTextPaste } from '@/ui-hooks/useTextPaste';

/**
 * Form component for mock-login
 * @param isLoading
 * @param onLogin
 * @param serverSideError
 * @constructor
 */
export function MockLoginForm({
    isLoading,
    onLogin,
    serverSideError,
}: LoginProps<MockLogin>) {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        clearErrors,
        setValue,
        setError,

        formState: {
            errors,
        },
    } = useForm<MockLogin>({
        defaultValues: {
            isStudent: true,
        },
    });
    useServersideFormErrors<MockLogin>(clearErrors, setError, serverSideError);

    const handleTextPaste = useTextPaste(setValue);

    const onSubmit = handleSubmit((data) => onLogin(data));

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group>
                <Form.Label>
                    {t('common.userCode')}
                    :
                </Form.Label>
                <Form.Control
                    type="text"
                    {...register('userCode', {
                        required: true,
                        minLength: 6,
                        maxLength: 6,
                    })}
                    onPaste={handleTextPaste}
                />
                {errors.userCode && <FormError message={t('login.userCodeRequired')} />}
            </Form.Group>

            <Form.Group>
                <Form.Label>
                    {t('common.name')}
                    :
                </Form.Label>
                <Form.Control
                    type="text"
                    {...register('name', {
                        required: t('login.nameRequired')
                            .toString(),
                    })}
                    onPaste={handleTextPaste}
                />
                {errors.name && <FormError message={errors.name.message} />}
            </Form.Group>

            <Form.Group>
                <Form.Label>
                    {t('common.officialEmail')}
                    :
                </Form.Label>
                <Form.Control
                    type="email"
                    {...register('email', {
                        required: t('login.emailRequired')
                            .toString(),
                    })}
                />
                {errors.email && <FormError message={errors.email.message} />}
            </Form.Group>

            <Form.Group>
                <Form.Check type="checkbox" id="isStudent" label={t('login.student')} {...register('isStudent')} />
                <Form.Check type="checkbox" id="isTeacher" label={t('login.instructor')} {...register('isTeacher')} />
                <Form.Check type="checkbox" id="isAdmin" label={t('login.admin')} {...register('isAdmin')} />
            </Form.Group>

            <LoginButton isLoading={isLoading} />
        </Form>
    );
}
