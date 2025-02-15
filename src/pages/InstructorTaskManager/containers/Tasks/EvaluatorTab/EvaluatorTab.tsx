import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    faDesktop,
    faListCheck,
    faMagnifyingGlassChart,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonGroup } from 'react-bootstrap';
import { Task } from '@/resources/instructor/Task';
import {
    useEvaluatorAdditionalInformation,
    useSetupAutoTester, useSetupCodeChecker,
    useSetupEvaluatorEnvironment,
} from '@/hooks/instructor/EvaluatorHooks';
import { useActualSemester } from '@/hooks/common/SemesterHooks';
import { ExpandableSection } from '@/components/ExpadanbleSection/ExpandableSection';
import { AutoTesterSettings } from '@/pages/InstructorTaskManager/containers/Tasks/EvaluatorTab/AutoTesterSettings';
import { EnvironmentSettings } from '@/pages/InstructorTaskManager/containers/Tasks/EvaluatorTab/EnvironmentSettings';
import { EvaluatorTemplate } from '@/resources/instructor/EvaluatorTemplate';
import { useShow } from '@/ui-hooks/useShow';
import {
    SectionHeaderIcon,
} from '@/pages/InstructorTaskManager/components/Tasks/EvaluatorTab/SectionHeaderIcon';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { CodeCheckerSettings } from '@/pages/InstructorTaskManager/containers/Tasks/EvaluatorTab/CodeCheckerSettings';
import {
    TemplateListDropdownButton,
} from '@/pages/InstructorTaskManager/components/Tasks/EvaluatorTab/TemplateListDropdownButton';

type Props = {
    task: Task
}

/**
 * Displays auto tester settings and test cases for the given task
 * @param task
 * @constructor
 */
export function EvaluatorTab({ task }: Props) {
    const { t } = useTranslation();
    const actualSemester = useActualSemester();
    const additionalEvaluatorInformation = useEvaluatorAdditionalInformation(task.id, true);
    // Opened sections
    const showEnvironmentSettings = useShow(true);
    const showAutoTesterSettings = useShow(false);
    const showStaticCodeAnalyzerSettings = useShow(false);

    // Template selection
    const [selectedTemplate, setSelectedTemplate] = useState<EvaluatorTemplate | null>(null);
    const setupEvaluatorEnvironment = useSetupEvaluatorEnvironment(task.id);
    const setupAutoTester = useSetupAutoTester(task.id);
    const setupCodeChecker = useSetupCodeChecker(task.id);

    const handleTemplateApplyConfirm = async () => {
        if (!selectedTemplate) {
            return;
        }

        // Apply the template
        await setupEvaluatorEnvironment.mutateAsync({
            imageName: selectedTemplate.image,
            files: null,
            testOS: selectedTemplate.os,
        });

        await setupAutoTester.mutateAsync({
            autoTest: selectedTemplate.autoTest,
            appType: selectedTemplate.appType,
            port: selectedTemplate.port,
            compileInstructions: selectedTemplate.compileInstructions,
            runInstructions: selectedTemplate.runInstructions,
            showFullErrorMsg: true,
            reevaluateAutoTest: false,
        });

        await setupCodeChecker.mutateAsync({
            staticCodeAnalysis: selectedTemplate.staticCodeAnalysis,
            staticCodeAnalyzerTool: selectedTemplate.staticCodeAnalyzerTool,
            codeCheckerCompileInstructions: selectedTemplate.codeCheckerCompileInstructions,
            codeCheckerSkipFile: selectedTemplate.codeCheckerSkipFile,
            codeCheckerToggles: selectedTemplate.codeCheckerToggles,
            staticCodeAnalyzerInstructions: selectedTemplate.staticCodeAnalyzerInstructions,
            reevaluateStaticCodeAnalysis: false,
        });

        // Open sections
        showEnvironmentSettings.toShow();
        showAutoTesterSettings.toShow();
        showStaticCodeAnalyzerSettings.toShow();

        // Set the selected template to null to close the modal
        setSelectedTemplate(null);
    };

    // Render
    if (!additionalEvaluatorInformation.data) {
        return null;
    }

    const isActualSemester = actualSemester.check(task.semesterID);

    return (
        <>
            {/* Top level toolbar with template list button */}
            <ButtonGroup className="mt-2 mb-4">
                <TemplateListDropdownButton
                    disabled={!isActualSemester}
                    templates={additionalEvaluatorInformation.data.templates}
                    setSelectedTemplate={setSelectedTemplate}
                />
            </ButtonGroup>

            {/* Confirm modal for template selection */}
            <ConfirmModal
                description={t('task.evaluator.templateSelectConfirmDescription')}
                title={t('common.areYouSure')}
                isConfirmDialogOpen={!!selectedTemplate}
                isLoading={setupEvaluatorEnvironment.isLoading || setupAutoTester.isLoading}
                onConfirm={handleTemplateApplyConfirm}
                onCancel={() => setSelectedTemplate(null)}
            />

            { /* Display Docker environment settings */ }
            <ExpandableSection
                show={showEnvironmentSettings.show}
                onToggle={showEnvironmentSettings.toggle}
                header={(
                    <>
                        <SectionHeaderIcon
                            icon={faDesktop}
                            active={additionalEvaluatorInformation.data.imageSuccessfullyBuilt}
                        />
                        {' '}
                        {t('task.evaluator.environment')}
                    </>
                )}
                content={(
                    <EnvironmentSettings
                        task={task}
                        additionalInformation={additionalEvaluatorInformation.data}
                    />
                )}
            />

            {additionalEvaluatorInformation.data.imageSuccessfullyBuilt
                ? (
                    <>
                        { /* Display automatic tester settings */ }
                        <ExpandableSection
                            show={showAutoTesterSettings.show}
                            onToggle={showAutoTesterSettings.toggle}
                            header={(
                                <>
                                    <SectionHeaderIcon
                                        icon={faListCheck}
                                        active={
                                            additionalEvaluatorInformation.data.imageSuccessfullyBuilt
                                            && !!task.autoTest
                                        }
                                    />
                                    {' '}
                                    {t('task.evaluator.autoTester')}
                                </>
                            )}
                            content={(
                                <AutoTesterSettings
                                    task={task}
                                    additionalInformation={additionalEvaluatorInformation.data}
                                />
                            )}
                        />

                        { /* Display CodeChecker settings */ }
                        <ExpandableSection
                            show={showStaticCodeAnalyzerSettings.show}
                            onToggle={showStaticCodeAnalyzerSettings.toggle}
                            header={(
                                <>
                                    <SectionHeaderIcon
                                        icon={faMagnifyingGlassChart}
                                        flip="horizontal"
                                        active={additionalEvaluatorInformation.data.imageSuccessfullyBuilt
                                            && task.staticCodeAnalysis}
                                    />
                                    {' '}
                                    {t('task.evaluator.staticCodeAnalysis')}
                                </>
                            )}
                            content={(
                                <CodeCheckerSettings
                                    task={task}
                                    supportedStaticAnalyzers={
                                        additionalEvaluatorInformation.data.supportedStaticAnalyzers
                                    }
                                    isActualSemester={isActualSemester}
                                />
                            )}
                        />
                    </>
                )
                : null}
        </>
    );
}
