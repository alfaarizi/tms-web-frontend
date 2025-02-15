import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import {
    useDuplicateGroupMutation,
    useGroup,
    useRemoveGroupMutation,
    useUpdateGroupMutation,
} from '@/hooks/instructor/GroupHooks';

import { GroupForm } from '@/pages/InstructorTaskManager/components/Groups/GroupForm';
import { Group } from '@/resources/instructor/Group';
import { GroupStudentsListTab } from '@/pages/InstructorTaskManager/containers/Groups/GroupStudentsListTab';
import { GroupInstructorsListTab } from '@/pages/InstructorTaskManager/containers/Groups/GroupInstructorsListTab';
import { ServerSideValidationError, ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { GroupStatsTab } from '@/pages/InstructorTaskManager/containers/Groups/GroupStatsTab';
import { GroupNotificationsTab } from '@/pages/InstructorTaskManager/containers/Notifications/GroupNotificationsTab';
import { useActualSemester } from '@/hooks/common/SemesterHooks';
import { GroupDetails } from '@/pages/InstructorTaskManager/components/Groups/GroupDetails';
import { TabbedInterface } from '@/components/TabbedInterface';
import { useNotifications } from '@/hooks/common/useNotifications';
import {
    useCancelCanvasSyncMutation,
    useCanvasSetupMutation,
    useCanvasSyncMutation,
} from '@/hooks/instructor/CanvasHooks';
import { useShow } from '@/ui-hooks/useShow';
import { SetupCanvasModal } from '@/pages/InstructorTaskManager/containers/Groups/SetupCanvasModal';
import { CanvasSetupData } from '@/resources/instructor/CanvasSetupData';
import { GroupTasksTab } from '@/pages/InstructorTaskManager/containers/Groups/GroupTasksTab';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';

type Params = {
    id?: string,
    activeTab?: string,
}

export function GroupPage() {
    const { t } = useTranslation();
    const history = useHistory();
    const params = useParams<Params>();
    const location = useLocation();
    const groupID = parseInt(params.id || '-1', 10);
    const group = useGroup(groupID);
    const searchParams = new URLSearchParams(location.search);
    const activeTab = searchParams.get('tab') || 'tasks';
    const updateMutation = useUpdateGroupMutation();
    const showEditForm = useShow();
    const removeMutation = useRemoveGroupMutation();
    const duplicateMutation = useDuplicateGroupMutation();
    const canvasSyncMutation = useCanvasSyncMutation(groupID);
    const cancelCanvasSyncMutation = useCancelCanvasSyncMutation(groupID, group.data?.semesterID);
    const canvasSetupMutation = useCanvasSetupMutation(groupID, group.data?.semesterID);
    const showCanvasSetupModal = useShow();
    const showCancelCanvasSetupModal = useShow();
    const actualSemester = useActualSemester();
    const [editErrorBody, setEditErrorBody] = useState<ValidationErrorBody | null>(null);
    const notifications = useNotifications();

    // Hide edit for when group changes
    useEffect(() => {
        showEditForm.toHide();
    }, [groupID]);

    if (!group.data) {
        return null;
    }

    // Saves group data after edit
    const handleEditSave = async (groupData: Group) => {
        try {
            await updateMutation.mutateAsync(groupData);
            showEditForm.toHide();
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setEditErrorBody(e.body);
            }
        }
    };

    // Remove group
    const handleRemove = async () => {
        try {
            await removeMutation.mutateAsync(group.data);
            history.push('/instructor/task-manager');
        } catch (e) {
            // Already handled globally
        }
    };

    // Duplicate group
    const handleDuplicate = async () => {
        try {
            await duplicateMutation.mutateAsync(group.data);
            notifications.push({
                variant: 'success',
                message: t('group.successfulDuplication'),
            });
        } catch (e) {
            // Already handled globally
        }
    };

    // Synchronize group with Canvas, if synchronization is set up correctly
    const handleCanvasSync = async () => {
        if (group.data.isCanvasCourse) {
            try {
                await canvasSyncMutation.mutateAsync();
                notifications.push({
                    variant: 'success',
                    message: t('group.successfulCanvasSync'),
                });
            } catch (e) {
                // Already handled globally
            }
        } else if (group.data.canvasCanBeSynchronized) {
            showCanvasSetupModal.toShow();
        }
    };

    // Cancel Canvas synchronization
    const handleCancelCanvasSync = async () => {
        if (group.data.isCanvasCourse) {
            try {
                await cancelCanvasSyncMutation.mutateAsync();
                notifications.push({
                    variant: 'success',
                    message: t('group.successfulCancelCanvasSync'),
                });
                showCancelCanvasSetupModal.toHide();
            } catch (e) {
                // Already handled globally
            }
        }
    };

    // Save Canvas synchronization settings
    const handleCanvasSetup = async (data: CanvasSetupData) => {
        try {
            await canvasSetupMutation.mutateAsync(data);
            notifications.push({
                variant: 'success',
                message: t('group.successfulCanvasSync'),
            });
        } catch (e) {
            // Already handled globally
        } finally {
            showCanvasSetupModal.toHide();
        }
    };

    // Render
    return (
        <>
            {showEditForm.show
                ? (
                    <GroupForm
                        title={t('group.editGroup')}
                        editData={group?.data}
                        onSave={handleEditSave}
                        serverSideError={editErrorBody}
                        onCancel={showEditForm.toHide}
                        isLoading={updateMutation.isLoading}
                    />
                )
                : (
                    <GroupDetails
                        isActualSemester={actualSemester.check(group.data.semesterID)}
                        canvasSyncInProgress={canvasSyncMutation.isLoading
                            || canvasSetupMutation.isLoading
                            || cancelCanvasSyncMutation.isLoading}
                        group={group.data}
                        onEdit={showEditForm.toShow}
                        onDuplicate={handleDuplicate}
                        onRemove={handleRemove}
                        onCanvasSync={handleCanvasSync}
                        onCancelCanvasSync={showCancelCanvasSetupModal.toShow}
                    />
                )}

            <TabbedInterface defaultActiveKey={activeTab} id="group-tabs">
                <Tab eventKey="tasks" title={t('task.tasks')}>
                    <GroupTasksTab group={group.data} />
                </Tab>
                <Tab eventKey="students" title={t('common.students')}>
                    <GroupStudentsListTab group={group.data} />
                </Tab>
                <Tab eventKey="instructors" title={t('common.instructors')}>
                    <GroupInstructorsListTab group={group.data} />
                </Tab>
                <Tab eventKey="stats" title={t('group.stats.stats')}>
                    <GroupStatsTab group={group.data} />
                </Tab>
                <Tab eventKey="notifications" title={t('common.notifications')}>
                    <GroupNotificationsTab group={group.data} />
                </Tab>
            </TabbedInterface>

            <SetupCanvasModal
                show={showCanvasSetupModal.show}
                onSave={handleCanvasSetup}
                onCancel={showCanvasSetupModal.toHide}
                inProgress={canvasSetupMutation.isLoading}
            />

            <ConfirmModal
                description={t('common.cancelCanvasModalDesc')}
                isConfirmDialogOpen={showCancelCanvasSetupModal.show}
                onCancel={() => { showCancelCanvasSetupModal.toHide(); }}
                onConfirm={handleCancelCanvasSync}
                title={t('common.areYouSure')}
                isLoading={cancelCanvasSyncMutation.isLoading}
            />
        </>
    );
}
