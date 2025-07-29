import { useTranslation } from 'react-i18next';
import { ButtonGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { IpRestriction } from '@/resources/admin/IpRestriction';
import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { DeleteToolbarButton } from '@/components/Buttons/DeleteToolbarButton';
import { useRemoveIpRestrictionMutation } from '@/hooks/admin/IpRestrictionHooks';

type Props = {
    ipRestriction: IpRestriction;
}

export function IpRestrictionListItem({ ipRestriction }: Props) {
    const { t } = useTranslation();
    const removeIpRestrictionMutation = useRemoveIpRestrictionMutation();

    const handleDelete = async () => {
        try {
            await removeIpRestrictionMutation.mutateAsync(ipRestriction);
        } catch (e) {
            // already handled globally
        }
    };

    return (
        <tr>
            <td>{ipRestriction.name}</td>
            <td>{ipRestriction.ipAddress}</td>
            <td>{ipRestriction.ipMask}</td>
            <td>
                <ButtonGroup className="mt-1">
                    <LinkContainer to={`edit-ip-restriction/${ipRestriction.id}`}>
                        <ToolbarButton text={t('common.edit')} icon={faEdit} />
                    </LinkContainer>
                    <DeleteToolbarButton onDelete={handleDelete} itemName={ipRestriction.name} />
                </ButtonGroup>
            </td>
        </tr>
    );
}
