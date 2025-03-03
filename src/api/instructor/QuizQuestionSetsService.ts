import { axiosInstance } from 'api/axiosInstance';
import { QuizQuestionSet } from 'resources/instructor/QuizQuestionSet';
import { Image } from 'resources/common/Image';
import { QuizImageUploadResult } from 'resources/instructor/QuizImageUploadResult';

export async function index() {
    const res = await axiosInstance.get<QuizQuestionSet[]>('/instructor/quiz-question-sets');
    return res.data;
}

export async function view(id: number) {
    const res = await axiosInstance.get<QuizQuestionSet>(`/instructor/quiz-question-sets/${id}`);
    return res.data;
}

export async function create(questionSet: QuizQuestionSet) {
    const res = await axiosInstance.post<QuizQuestionSet>('/instructor/quiz-question-sets', questionSet);
    return res.data;
}

export async function update(questionSet: QuizQuestionSet) {
    const res = await axiosInstance
        .patch<QuizQuestionSet>(`/instructor/quiz-question-sets/${questionSet.id}`, questionSet);
    return res.data;
}

export async function remove(id: number) {
    await axiosInstance.delete<QuizQuestionSet>(`/instructor/quiz-question-sets/${id}`);
}

export async function duplicate(id: number) {
    const res = await axiosInstance.post<QuizQuestionSet>(`/instructor/quiz-question-sets/${id}/duplicate`);
    return res.data;
}

export async function listImages(id: number) {
    const res = await axiosInstance.get<Image[]>(`/instructor/quiz-question-sets/${id}/images`);
    return res.data;
}

export async function uploadImages(id: number, files: File[]) {
    const formData = new FormData();
    for (let i = 0; i < files.length; ++i) {
        formData.append('path[]', files[i]);
    }

    const res = await axiosInstance.post<QuizImageUploadResult>(
        `instructor/quiz-question-sets/${id}/images`,
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
    await axiosInstance.delete(`/instructor/quiz-question-sets/${id}/images/${filename}`);
}
