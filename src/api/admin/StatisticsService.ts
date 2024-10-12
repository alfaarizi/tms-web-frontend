import { axiosInstance } from 'api/axiosInstance';
import { Statistics } from 'resources/admin/Statistics';
import { StatisticsSemester } from 'resources/admin/StatisticsSemester';

export async function get() {
    const res = await axiosInstance.get<Statistics>('/admin/statistics');
    return res.data;
}

export async function getDetailed(semesterIDs: number[]) {
    // backend should have another endpoint to accommodate for this type of request
    const promises = semesterIDs.map((s) => axiosInstance.get<StatisticsSemester>('/admin/statistics', {
        params: { semesterID: s },
    }));
    const results = await Promise.all(promises);
    return results.map((r) => r.data);
}
