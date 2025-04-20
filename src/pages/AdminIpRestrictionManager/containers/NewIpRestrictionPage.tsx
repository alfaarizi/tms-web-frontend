import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { IpRestriction } from '@/resources/admin/IpRestriction';
import { ServerSideValidationError, ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { useCreateIpRestrictionMutation } from '@/hooks/admin/IpRestrictionHooks';
import { IpRestrictionForm } from '@/pages/AdminIpRestrictionManager/components/IpRestrictionForm';
import { SingleColumnLayout } from '@/layouts/SingleColumnLayout';

export function NewIpRestrictionPage() {
    const { t } = useTranslation();
    const history = useHistory();
    const createMutation = useCreateIpRestrictionMutation();
    const [addErrorBody, setAddErrorBody] = useState<ValidationErrorBody | null>(null);

    const handleSave = async (ipRestriction: IpRestriction) => {
        try {
            await createMutation.mutateAsync(ipRestriction);
            history.replace('/admin/ip-restriction-manager/ip-restriction');
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setAddErrorBody(e.body);
            }
        }
    };

    const handleSaveCancel = () => {
        history.push('/admin/ip-restriction-manager/ip-restriction');
    };

    return (
        <SingleColumnLayout>
            <IpRestrictionForm
                title={t('ipRestriction.newIpRestriction')}
                onSave={handleSave}
                onCancel={handleSaveCancel}
                serverSideError={addErrorBody}
                isLoading={createMutation.isLoading}
            />
        </SingleColumnLayout>
    );
}
