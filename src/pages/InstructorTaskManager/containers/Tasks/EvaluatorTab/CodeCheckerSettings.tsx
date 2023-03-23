import React from 'react';
import { Task } from 'resources/instructor/Task';
import {
    CodeCheckerSettingsForm,
} from 'pages/InstructorTaskManager/components/Tasks/EvaluatorTab/CodeCheckerSettingsForm';
import { useSetupCodeChecker } from 'hooks/instructor/EvaluatorHooks';
import { StaticAnalyzerTool } from 'resources/instructor/StaticAnalyzerTool';

type Props = {
    task: Task,
    supportedStaticAnalyzers: StaticAnalyzerTool[],
    isActualSemester: boolean,
}

export function CodeCheckerSettings({
    task, supportedStaticAnalyzers, isActualSemester,
}: Props) {
    const setupCodeChecker = useSetupCodeChecker(task.id);

    return (
        <CodeCheckerSettingsForm
            task={task}
            onSave={setupCodeChecker.mutate}
            inProgress={setupCodeChecker.isLoading}
            supportedStaticAnalyzers={supportedStaticAnalyzers}
            isActualSemester={isActualSemester}
        />
    );
}
