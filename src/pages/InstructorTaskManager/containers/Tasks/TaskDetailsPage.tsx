import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tab } from 'react-bootstrap';
import { useHistory } from 'react-router';

import { useRemoveTaskMutation, useTask, useUpdateTaskMutation } from 'hooks/instructor/TaskHooks';
import { Task } from 'resources/instructor/Task';
import { useTranslation } from 'react-i18next';
import { TaskForm } from 'pages/InstructorTaskManager/components/Tasks/TaskForm';
import { TaskFilesTab } from 'pages/InstructorTaskManager/containers/Tasks/TaskFilesTab';
import { SubmissionsListTab } from 'pages/InstructorTaskManager/containers/Tasks/SubmissionsListTab';
import { useActualSemester } from 'hooks/common/SemesterHooks';
import { useShow } from 'ui-hooks/useShow';
import { TabbedInterface } from 'components/TabbedInterface';
import { EvaluatorTab } from 'pages/InstructorTaskManager/containers/Tasks/EvaluatorTab/EvaluatorTab';
import { TaskDetails } from 'pages/InstructorTaskManager/components/Tasks/TaskDetails';
import { ServerSideValidationError, ValidationErrorBody } from 'exceptions/ServerSideValidationError';
import { Submission } from 'resources/instructor/Submission';
import { usePrivateSystemInfoQuery } from 'hooks/common/SystemHooks';
import { useStartCodeCompassMutation, useStopCodeCompassMutation } from 'hooks/instructor/SubmissionHooks';
import { CodeCompassTab } from './CodeCompassTab';

type Params = {
    id?: string
}

export const TaskDetailsPage = () => {
    const { t } = useTranslation();
    const { id } = useParams<Params>();
    const history = useHistory();
    const task = useTask(parseInt(id || '-1', 10));
    const updateMutation = useUpdateTaskMutation();
    const removeMutation = useRemoveTaskMutation();
    const actualSemester = useActualSemester();
    const privateSystemInfo = usePrivateSystemInfoQuery();
    const showEdit = useShow();
    const startCodeCompassMutation = useStartCodeCompassMutation(parseInt(id || '-1', 10));
    const stopCodeCompassMutation = useStopCodeCompassMutation(parseInt(id || '-1', 10));
    const [updateErrorBody, setUpdateErrorBody] = useState<ValidationErrorBody | null>(null);

    if (!task.data) {
        return null;
    }

    const handleEditSave = async (data: Task) => {
        try {
            await updateMutation.mutateAsync({
                ...data,
                id: task.data.id,
            });
            showEdit.toHide();
            setUpdateErrorBody(null);
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setUpdateErrorBody(e.body);
            }
        }
    };

    const handleEditCancel = () => {
        showEdit.toHide();
        setUpdateErrorBody(null);
    };

    const handleRemove = async () => {
        try {
            await removeMutation.mutateAsync(task.data);
            history.push(`../groups/${task.data.groupID}`);
        } catch (e) {
            // Already handled globally
        }
    };

    const handleStartCodeCompass = async (file: Submission) => {
        try {
            const data: Submission = await startCodeCompassMutation.mutateAsync(file);
            if (data.codeCompass?.port) {
                window.open(`http://${window.location.hostname}:${data.codeCompass.port}/#`, '_blank');
            }
        } catch (e) {
            // Already handled globally
        }
    };

    const handleStopCodeCompass = async (file: Submission) => {
        try {
            await stopCodeCompassMutation.mutateAsync(file);
        } catch (e) {
            // Already handled globally
        }
    };

    return (
        <>
            {showEdit.show ? (
                <TaskForm
                    title={t('task.editTask')}
                    timezone={task.data.group?.timezone || ''}
                    onSave={handleEditSave}
                    onCancel={handleEditCancel}
                    editData={task.data}
                    showVersionControl={false}
                    serverSideError={updateErrorBody}
                    isLoading={updateMutation.isLoading}
                />
            )
                : (
                    <TaskDetails
                        isActualSemester={actualSemester.check(task.data.semesterID)}
                        onEdit={showEdit.toShow}
                        onRemove={handleRemove}
                        task={task.data}
                        showVersionControl={!!privateSystemInfo.data && privateSystemInfo.data.isVersionControlEnabled}
                    />
                )}

            <TabbedInterface defaultActiveKey="solutions" id="group-tabs">
                <Tab eventKey="solutions" title={t('task.solutions')}>
                    <SubmissionsListTab
                        task={task.data}
                        handleStartCodeCompass={handleStartCodeCompass}
                        handleStopCodeCompass={handleStopCodeCompass}
                    />
                </Tab>
                <Tab eventKey="taskFiles" title={t('task.taskFiles')}>
                    <TaskFilesTab task={task.data} />
                </Tab>
                {!!privateSystemInfo.data && privateSystemInfo.data.isAutoTestEnabled
                    ? (
                        <Tab eventKey="tester" title={t('task.evaluator.tabName')}>
                            <EvaluatorTab task={task.data} />
                        </Tab>
                    )
                    : null}
                {!!privateSystemInfo.data && privateSystemInfo.data.isCodeCompassEnabled
                    ? (
                        <Tab eventKey="codeCompass" title={t('codeCompass.codeCompass')}>
                            <CodeCompassTab task={task.data} />
                        </Tab>
                    )
                    : null}

            </TabbedInterface>
        </>
    );
};
