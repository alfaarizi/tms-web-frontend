import { useTranslation } from 'react-i18next';
import { ButtonGroup, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { IpRestriction } from '@/resources/admin/IpRestriction';
import { SingleColumnLayout } from '@/layouts/SingleColumnLayout';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { IpRestrictionListItem } from '@/pages/AdminIpRestrictionManager/containers/IpRestrictionListItem';
import { ToolbarButton } from '@/components/Buttons/ToolbarButton';

type Props = {
    ipRestrictions?: IpRestriction[],
}

export function IpRestrictionList({
    ipRestrictions,
}: Props) {
    const { t } = useTranslation();

    return (
        <SingleColumnLayout>
            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>{t('ipRestriction.ipRestrictions')}</CustomCardTitle>
                    <ButtonGroup className="mt-2">
                        <LinkContainer to="new-ip-restriction">
                            <ToolbarButton
                                icon={faPlus}
                                text={t('ipRestriction.newIpRestriction')}
                                displayTextBreakpoint="xs"
                            />
                        </LinkContainer>
                    </ButtonGroup>
                </CustomCardHeader>
                <Table responsive>
                    <thead>
                        <tr>
                            <th className="border-top-0">{t('ipRestriction.name')}</th>
                            <th className="border-top-0">{t('ipRestriction.ipAddress')}</th>
                            <th className="border-top-0">{t('ipRestriction.ipMask')}</th>
                            <th className="border-top-0">{t('common.operations')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ipRestrictions?.map(
                            (ipRestriction) => (
                                <IpRestrictionListItem key={ipRestriction.id} ipRestriction={ipRestriction} />
                            ),
                        )}
                    </tbody>
                </Table>
            </CustomCard>
        </SingleColumnLayout>
    );
}
