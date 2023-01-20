import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DropdownItem from 'react-bootstrap/DropdownItem';
import {
    faDesktop,
    faClipboardList,
    faListCheck,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonGroup } from 'react-bootstrap';
import { Task } from 'resources/instructor/Task';
import {
    useAdditionalEvaluatorInformation,
    useSetupAutoTester,
    useSetupEvaluatorEnvironment,
} from 'hooks/instructor/EvaluatorHooks';
import { useActualSemester } from 'hooks/common/SemesterHooks';
import { ExpandableSection } from 'components/ExpadanbleSection/ExpandableSection';
import { AutoTesterSettings } from 'pages/InstructorTaskManager/containers/Tasks/EvaluatorTab/AutoTesterSettings';
import { EnvironmentSettings } from 'pages/InstructorTaskManager/containers/Tasks/EvaluatorTab/EnvironmentSettings';
import { ToolbarDropdown } from 'components/Buttons/ToolbarDropdown';
import { EvaluatorTemplate } from 'resources/instructor/EvaluatorTemplate';
import { useShow } from 'ui-hooks/useShow';
import {
    SectionHeaderIcon,
} from 'pages/InstructorTaskManager/components/Tasks/AutomaticEvaluatorTab/SectionHeaderIcon';
import { ConfirmModal } from 'components/Modals/ConfirmModal';

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
    const additionalEvaluatorInformation = useAdditionalEvaluatorInformation(task.id, true);
    // Opened sections
    const showEnvironmentSettings = useShow(true);
    const showAutoTesterSettings = useShow(false);
    const [selectedTemplate, setSelectedTemplate] = useState<EvaluatorTemplate | null>(null);

    const setupEvaluatorEnvironment = useSetupEvaluatorEnvironment(task.id);
    const setupAutoTester = useSetupAutoTester(task.id);

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
            showFullErrorMsg: false,
            reevaluateAutoTest: false,
        });

        // Open sections
        showEnvironmentSettings.toShow();
        showAutoTesterSettings.toShow();

        // Set the selected template to null to close the modal
        setSelectedTemplate(null);
    };

    // Render
    if (!additionalEvaluatorInformation.data) {
        return null;
    }

    return (
        <>
            {/* Top level toolbar with template list button */}
            <ButtonGroup className="mt-2 mb-4">
                <ToolbarDropdown
                    text={t('task.evaluator.templates')}
                    icon={faClipboardList}
                    disabled={!actualSemester.check(task.semesterID)}
                >
                    {additionalEvaluatorInformation.data.templates.map((template) => (
                        <DropdownItem
                            key={template.name}
                            onSelect={() => setSelectedTemplate(template)}
                        >
                            {template.name}
                        </DropdownItem>
                    ))}
                </ToolbarDropdown>
            </ButtonGroup>

            <ConfirmModal
                description={t('task.evaluator.templateSelectConfirmDescription')}
                title={t('common.areYouSure')}
                isConfirmDialogOpen={!!selectedTemplate}
                isLoading={setupEvaluatorEnvironment.isLoading || setupAutoTester.isLoading}
                onConfirm={handleTemplateApplyConfirm}
                onCancel={() => setSelectedTemplate(null)}
            />

            { /* Display Docker environment settings and file manager */ }
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

            { /* Display automatic tester settings */ }
            <ExpandableSection
                show={showAutoTesterSettings.show}
                onToggle={showAutoTesterSettings.toggle}
                header={(
                    <>
                        <SectionHeaderIcon
                            icon={faListCheck}
                            active={additionalEvaluatorInformation.data.imageSuccessfullyBuilt && !!task.autoTest}
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
        </>
    );
}
