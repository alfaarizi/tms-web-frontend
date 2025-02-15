import { Task } from '@/resources/instructor/Task';
import {
    EnvironmentSettingsForm,
} from '@/pages/InstructorTaskManager/components/Tasks/EvaluatorTab/EnvironmentSettingsForm';
import {
    useSetupEvaluatorEnvironment,
    useUpdateDockerImageMutation,
} from '@/hooks/instructor/EvaluatorHooks';
import { SetupEvaluatorEnvironment } from '@/resources/instructor/SetupEvaluatorEnvironment';
import { EvaluatorAdditionalInformation } from '@/resources/instructor/EvaluatorAdditionalInformation';
import { TestFileManager } from '@/pages/InstructorTaskManager/containers/Tasks/EvaluatorTab/TestFileManager';
import { useActualSemester } from '@/hooks/common/SemesterHooks';

type Props = {
    task: Task
    additionalInformation: EvaluatorAdditionalInformation,
}

export function EnvironmentSettings({ task, additionalInformation }: Props) {
    const actualSemester = useActualSemester();

    // Test settings hooks
    const setupMutation = useSetupEvaluatorEnvironment(task.id);
    const updateDockerImageMutation = useUpdateDockerImageMutation(task.id);

    // Update tester settings
    const handleTestUpdate = async (data: SetupEvaluatorEnvironment) => {
        try {
            await setupMutation.mutateAsync(data);
        } catch (e) {
            // Already handled globally
        }
    };

    // Update Docker image from repository
    const handleDockerImageUpdate = async () => {
        try {
            await updateDockerImageMutation.mutateAsync();
        } catch (e) {
            // Already handled globally
        }
    };

    return (
        <>
            <EnvironmentSettingsForm
                task={task}
                additionalInformation={additionalInformation}
                onSave={handleTestUpdate}
                onUpdateDockerImage={handleDockerImageUpdate}
                saveInProgress={setupMutation.isLoading}
                updateInProgress={updateDockerImageMutation.isLoading}
                isActualSemester={actualSemester.check(task.semesterID)}
            />
            <TestFileManager task={task} isActualSemester={actualSemester.check(task.semesterID)} />
        </>
    );
}
