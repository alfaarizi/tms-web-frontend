import { axiosInstance } from 'api/axiosInstance';
import { CanvasOauth2Response } from 'resources/instructor/CanvasOauth2Response';
import { CanvasCourse } from 'resources/instructor/CanvasCourse';
import { CanvasSection } from 'resources/instructor/CanvasSection';
import { CanvasSetupData } from 'resources/instructor/CanvasSetupData';

export async function setup(groupID: number, data: CanvasSetupData) {
    await axiosInstance.post<void>(`/instructor/canvas/setup?groupID=${groupID}`, data);
}

export async function sync(groupID: number) {
    await axiosInstance.post<void>(`/instructor/canvas/sync?groupID=${groupID}`);
}

export async function cancelSync(groupID: number) {
    await axiosInstance.post<void>(`/instructor/canvas/cancel-sync?groupID=${groupID}`);
}

export async function oauth2Response(data: CanvasOauth2Response) {
    await axiosInstance.post<void>('/instructor/canvas/oauth2-response', data);
}

export async function getCanvasCourses() {
    const res = await axiosInstance.get<CanvasCourse[]>('/instructor/canvas/courses');
    return res.data;
}

export async function getCanvasSections(courseID: number) {
    const res = await axiosInstance.get<CanvasSection[]>(
        '/instructor/canvas/sections',
        { params: { courseID } },
    );
    return res.data;
}
