import { axiosInstance } from 'api/axiosInstance';
import { ExamQuestionSet } from 'resources/instructor/ExamQuestionSet';
import { Image } from 'resources/common/Image';
import { ExamImageUploadResult } from 'resources/instructor/ExamImageUploadResult';

export async function index() {
    const res = await axiosInstance.get<ExamQuestionSet[]>('/instructor/exam-question-sets');
    return res.data;
}

export async function view(id: number) {
    const res = await axiosInstance.get<ExamQuestionSet>(`/instructor/exam-question-sets/${id}`);
    return res.data;
}

export async function create(questionSet: ExamQuestionSet) {
    const res = await axiosInstance.post<ExamQuestionSet>('/instructor/exam-question-sets', questionSet);
    return res.data;
}

export async function update(questionSet: ExamQuestionSet) {
    const res = await axiosInstance
        .patch<ExamQuestionSet>(`/instructor/exam-question-sets/${questionSet.id}`, questionSet);
    return res.data;
}

export async function remove(id: number) {
    await axiosInstance.delete<ExamQuestionSet>(`/instructor/exam-question-sets/${id}`);
}

export async function duplicate(id: number) {
    const res = await axiosInstance.post<ExamQuestionSet>(`/instructor/exam-question-sets/${id}/duplicate`);
    return res.data;
}

export async function listImages(id: number) {
    const res = await axiosInstance.get<Image[]>(`/instructor/exam-question-sets/${id}/images`);
    return res.data;
}

export async function uploadImages(id: number, files: File[]) {
    const formData = new FormData();
    for (let i = 0; i < files.length; ++i) {
        formData.append('path[]', files[i]);
    }

    const res = await axiosInstance.post<ExamImageUploadResult>(
        `instructor/exam-question-sets/${id}/images`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );
    return res.data;
}

export async function removeImage(id: number, filename: string) {
    await axiosInstance.delete(`/instructor/exam-question-sets/${id}/images/${filename}`);
}
