import { useQuery } from 'react-query';
import * as GroupService from '@/api/student/GroupsService';
import { Group } from '@/resources/student/Group';

export const QUERY_KEY = 'student/groups';

export function useGroup(groupID: number) {
    return useQuery<Group>([QUERY_KEY, { groupID }], () => GroupService.view(groupID));
}

export function useGroups(semesterID: number) {
    return useQuery<Group[]>([QUERY_KEY, { semesterID }], () => GroupService.index(semesterID));
}
