import { Route, Switch, useRouteMatch } from 'react-router';
import { useIpRestrictions } from '@/hooks/admin/IpRestrictionHooks';
import { IpRestrictionList } from '@/pages/AdminIpRestrictionManager/components/IpRestrictionList';
import { NewIpRestrictionPage } from '@/pages/AdminIpRestrictionManager/containers/NewIpRestrictionPage';
import { EditIpRestrictionPage } from '@/pages/AdminIpRestrictionManager/containers/EditIpRestrictionPage';

export function IpRestrictionManagerPage() {
    const { data: ipRestrictions } = useIpRestrictions();
    const { url } = useRouteMatch();

    return (
        <Switch>
            <Route path={`${url}/ip-restriction`}>
                <IpRestrictionList ipRestrictions={ipRestrictions} />
            </Route>
            <Route path={`${url}/new-ip-restriction`} exact>
                <NewIpRestrictionPage />
            </Route>
            <Route path={`${url}/edit-ip-restriction/:ipRestrictionID`} exact>
                <EditIpRestrictionPage />
            </Route>
        </Switch>
    );
}
