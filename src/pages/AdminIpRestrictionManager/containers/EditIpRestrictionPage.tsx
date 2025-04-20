import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { IpRestriction } from '@/resources/admin/IpRestriction';
import { ServerSideValidationError, ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { useIpRestriction, useUpdateIpRestrictionMutation } from '@/hooks/admin/IpRestrictionHooks';
import { IpRestrictionForm } from '@/pages/AdminIpRestrictionManager/components/IpRestrictionForm';
import { SingleColumnLayout } from '@/layouts/SingleColumnLayout';

type Params = {
    ipRestrictionID: string
}

export function EditIpRestrictionPage() {
    const { t } = useTranslation();
    const history = useHistory();
    const params = useParams<Params>();
    const ipRestriction = useIpRestriction(parseInt(params.ipRestrictionID, 10));
    const updateMutation = useUpdateIpRestrictionMutation();
    const [editErrorBody, setEditErrorBody] = useState<ValidationErrorBody | null>(null);

    // Saves the IP restriction data after edit
    const handleEditSave = async (ipRestrictionData: IpRestriction) => {
        try {
            await updateMutation.mutateAsync(ipRestrictionData);
            history.replace('/admin/ip-restriction-manager/ip-restriction');
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setEditErrorBody(e.body);
            }
        }
    };

    const handleSaveCancel = () => {
        history.push('/admin/ip-restriction-manager/ip-restriction');
    };

    if (!ipRestriction.data) {
        return null;
    }

    return (
        <SingleColumnLayout>
            <IpRestrictionForm
                title={t('ipRestriction.editIpRestriction')}
                editData={ipRestriction.data}
                onSave={handleEditSave}
                onCancel={handleSaveCancel}
                serverSideError={editErrorBody}
                isLoading={updateMutation.isLoading}
            />
        </SingleColumnLayout>
    );
}
