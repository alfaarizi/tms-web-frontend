import { useState } from 'react';
import { Breadcrumb, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';

import { TabbedInterface } from '@/components/TabbedInterface';
import { ServerSideValidationError, ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { useActualSemester } from '@/hooks/common/SemesterHooks';
import { usePrivateSystemInfoQuery } from '@/hooks/common/SystemHooks';
import { useStartCodeCompassMutation, useStopCodeCompassMutation } from '@/hooks/instructor/SubmissionHooks';
import { useRemoveTaskMutation, useTask, useUpdateTaskMutation } from '@/hooks/instructor/TaskHooks';
import { Submission } from '@/resources/instructor/Submission';
import { Task } from '@/resources/instructor/Task';
import { TaskForm } from '@/pages/InstructorTaskManager/components/Tasks/TaskForm';
import { TaskDetails } from '@/pages/InstructorTaskManager/components/Tasks/TaskDetails';
import { CodeCompassTab } from '@/pages/InstructorTaskManager/containers/Tasks/CodeCompassTab';
import { EvaluatorTab } from '@/pages/InstructorTaskManager/containers/Tasks/EvaluatorTab/EvaluatorTab';
import { SubmissionsListTab } from '@/pages/InstructorTaskManager/containers/Tasks/SubmissionsListTab';
import { TaskDescriptionTab } from '@/pages/InstructorTaskManager/containers/Tasks/TaskDescriptionTab';
import { TaskFilesTab } from '@/pages/InstructorTaskManager/containers/Tasks/TaskFilesTab';
import { useShow } from '@/ui-hooks/useShow';

type Params = {
    id?: string
}

export function TaskDetailsPage() {
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

    const handleEditSave = async (data: Task, emailNotification?: boolean) => {
        try {
            await updateMutation.mutateAsync({
                task: {
                    ...data,
                    id: task.data.id,
                },
                options: {
                    emailNotification: emailNotification ?? false,
                },
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
            {task.data.group ? (
                <Breadcrumb>
                    <LinkContainer to="/instructor/task-manager">
                        <Breadcrumb.Item>{t('navbar.taskmanager')}</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to={`/instructor/course-manager/courses/${task.data.group.courseID}`}>
                        <Breadcrumb.Item>{task.data.group.course.name}</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to={`/instructor/task-manager/groups/${task.data.groupID}`}>
                        <Breadcrumb.Item>{task.data.groupID}</Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to={`/instructor/task-manager/tasks/${task.data.id}`}>
                        <Breadcrumb.Item active>{task.data.name}</Breadcrumb.Item>
                    </LinkContainer>
                </Breadcrumb>
            ) : null}
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
            ) : (
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
                <Tab eventKey="description" title={t('task.description')}>
                    <TaskDescriptionTab taskCategory={task.data.category} taskDescription={task.data.description} />
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
}
