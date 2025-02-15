import { useTranslation } from 'react-i18next';

import { Task } from '@/resources/instructor/Task';
import { Alert } from 'react-bootstrap';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { CodeCompassParameters } from '@/resources/instructor/CodeCompassParameters';
import { useSetupCodeCompassParserMutation } from '@/hooks/instructor/TaskHooks';
import { CodeCompassForm } from '@/pages/InstructorTaskManager/components/Tasks/CodeCompassForm';

type Props = {
    task: Task
}

export function CodeCompassTab({ task }: Props) {
    const { t } = useTranslation();
    const setupCodeCompassParserMutation = useSetupCodeCompassParserMutation(task.id);

    const onSubmit = async (data: CodeCompassParameters) => {
        try {
            await setupCodeCompassParserMutation.mutateAsync(data);
        } catch (e) {
            // Already handled globally
        }
    };

    const parameters: CodeCompassParameters = {
        compileInstructions: task.codeCompassCompileInstructions || '',
        packagesInstallInstructions: task.codeCompassPackagesInstallInstructions || '',
    };

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>
                    {t('codeCompass.parameters')}
                </CustomCardTitle>
            </CustomCardHeader>
            <Alert variant="info">
                {t('codeCompass.compileInstructionsNeededPrefix')}
                <a href="https://hub.docker.com/r/modelcpp/codecompass">Docker Hub</a>
                {t('codeCompass.compileInstructionsNeededPostfix')}
            </Alert>
            <hr />
            <CodeCompassForm
                parameters={parameters}
                inProgress={setupCodeCompassParserMutation.isLoading}
                onSave={onSubmit}
            />
        </CustomCard>
    );
}
