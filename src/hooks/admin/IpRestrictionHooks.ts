import { useMutation, useQuery, useQueryClient } from 'react-query';
import * as IpRestrictionService from '@/api/admin/IpRestrictionService';
import { IpRestriction } from '@/resources/admin/IpRestriction';

export const QUERY_KEY = 'admin/ip-restriction';
export const COMMON_QUERY_KEY = 'common/ip-restriction';

export function useIpRestrictions() {
    return useQuery([QUERY_KEY], () => IpRestrictionService.index());
}

export function useIpRestriction(ipRestrictionID: number) {
    return useQuery([QUERY_KEY, { ipRestrictionID }], () => IpRestrictionService.view(ipRestrictionID));
}

export function useCreateIpRestrictionMutation() {
    const queryClient = useQueryClient();

    return useMutation((newIpRestriction: IpRestriction) => IpRestrictionService.create(newIpRestriction), {
        onSuccess: async (data) => {
            const oldIpRestrictions = queryClient.getQueryData<IpRestriction[]>(QUERY_KEY);
            if (oldIpRestrictions) {
                queryClient.setQueryData(QUERY_KEY, [...oldIpRestrictions, data]);
            }

            await queryClient.invalidateQueries([COMMON_QUERY_KEY]);
        },
    });
}

export function useUpdateIpRestrictionMutation() {
    const queryClient = useQueryClient();

    return useMutation((updatedIpRestriction: IpRestriction) => IpRestrictionService.update(updatedIpRestriction), {
        onSuccess: async (data) => {
            const key = [QUERY_KEY, { ipRestrictionID: data.id }];
            const oldIpRestriction = queryClient.getQueryData<IpRestriction[]>(key);
            if (oldIpRestriction) {
                queryClient.setQueryData(key, data);
            }

            const oldIpRestrictions = queryClient.getQueryData<IpRestriction[]>(QUERY_KEY);
            if (oldIpRestrictions) {
                const newList = oldIpRestrictions.map(
                    (restriction) => (restriction.id === data.id ? data : restriction),
                );
                queryClient.setQueryData(QUERY_KEY, newList);
            }

            await queryClient.invalidateQueries([COMMON_QUERY_KEY]);
        },
    });
}

export function useRemoveIpRestrictionMutation() {
    const queryClient = useQueryClient();

    return useMutation((ipRestriction: IpRestriction) => IpRestrictionService.remove(ipRestriction.id), {
        onSuccess: async (_data, variable) => {
            const key = [QUERY_KEY];
            const oldIpRestrictions = queryClient.getQueryData<IpRestriction[]>(key);

            if (oldIpRestrictions) {
                queryClient.setQueryData(key, oldIpRestrictions.filter(
                    (restriction) => restriction.id !== variable.id,
                ));
            }

            await queryClient.invalidateQueries([COMMON_QUERY_KEY]);
        },
    });
}
