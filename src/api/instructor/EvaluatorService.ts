import { axiosInstance } from 'api/axiosInstance';
import { Task } from 'resources/instructor/Task';
import { EvaluatorAdditionalInformation } from 'resources/instructor/EvaluatorAdditionalInformation';
import { SetupAutoTester } from 'resources/instructor/SetupAutoTester';
import { SetupEvaluatorEnvironment } from 'resources/instructor/SetupEvaluatorEnvironment';

export async function updateDockerImage(id: number) {
    const res = await axiosInstance.post<EvaluatorAdditionalInformation>(
        `/instructor/tasks/${id}/evaluator/update-docker-image`,
    );
    return res.data;
}

export async function additionalEvaluatorInformation(id: number) {
    const res = await axiosInstance.get<EvaluatorAdditionalInformation>(
        `/instructor/tasks/${id}/evaluator/additional-information`,
    );
    return res.data;
}

export async function setupAutoTester(id: number, data: SetupAutoTester) {
    const res = await axiosInstance.post<Task>(
        `/instructor/tasks/${id}/evaluator/setup-auto-tester?expand=group`,
        data,
    );
    return res.data;
}

export async function setupEvaluatorEnvironment(id: number, data: SetupEvaluatorEnvironment) {
    // Build form data to upload files
    const formData = new FormData();
    formData.append('testOS', data.testOS);
    if (data.imageName) {
        formData.append('imageName', data.imageName);
    }

    if (!!data.files && data.files.length > 0) {
        for (let i = 0; i < data.files.length; ++i) {
            formData.append('files[]', data.files[i]);
        }
    }

    const res = await axiosInstance.post<Task>(
        `/instructor/tasks/${id}/evaluator/setup-environment?expand=group`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    );

    return res.data;
}
