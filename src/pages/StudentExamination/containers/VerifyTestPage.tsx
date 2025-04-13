import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router';

import { VerifyItemForm } from '@/components/VerifyItemForm';
import { ServerSideValidationError, ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { useNotifications } from '@/hooks/common/useNotifications';
import {
    useUnlockTestMutation,
} from '@/hooks/student/QuizTestInstanceHooks';
import { UnlockTest } from '@/resources/student/UnlockTest';

type Params = {
    id?: string
}

export function VerifyTestPage() {
    const { t } = useTranslation();
    const { params } = useRouteMatch<Params>();
    const history = useHistory();
    const id = parseInt(params.id || '-1', 10);
    const unlockMutation = useUnlockTestMutation();
    const notifications = useNotifications();
    const [unlockError, setUnlockError] = useState<ValidationErrorBody | null>(null);

    const handleUnlock = async (data: UnlockTest) => {
        try {
            await unlockMutation.mutateAsync({ ...data, id });
            notifications.push(
                {
                    message: t('passwordProtectedTest.unlockSuccess'),
                    variant: 'success',
                },
            );
            history.push(`/student/quiz/test-instances/${id}/writer`);
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setUnlockError(e.body);
            }
        }
    };

    return (
        <VerifyItemForm
            onSave={handleUnlock}
            serverSideError={unlockError}
            isLoading={unlockMutation.isLoading}
            hasIpCheck={false}
            cardTitle={t('passwordProtectedTest.passwordProtected')}
            cardLabel={t('login.password')}
            cardWarning={t('passwordProtectedTest.studentWarning')}
            submitButtonLabel={t('passwordProtectedTest.unlock')}
        />
    );
}
