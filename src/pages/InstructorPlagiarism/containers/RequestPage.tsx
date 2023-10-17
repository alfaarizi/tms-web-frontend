import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';

import {
    usePlagiarismRequest,
    useRemovePlagiarismMutation,
    useRunMutation,
    useUpdatePlagiarismMutation,
} from 'hooks/instructor/PlagiarismHooks';
import { RequestDetails } from 'pages/InstructorPlagiarism/components/RequestDetails';
import { Result } from 'pages/InstructorPlagiarism/components/Results';
import { useShow } from 'ui-hooks/useShow';
import { Plagiarism } from 'resources/instructor/Plagiarism';
import { EditForm } from 'pages/InstructorPlagiarism/components/EditForm';
import { useNotifications } from 'hooks/common/useNotifications';
import { useTranslation } from 'react-i18next';
import { useActualSemester } from 'hooks/common/SemesterHooks';

type Params = {
    id?: string
}

export function RequestPage() {
    const { t } = useTranslation();
    const params = useParams<Params>();
    const id = parseInt(params.id || '-1', 10);
    const history = useHistory();
    const request = usePlagiarismRequest(id);
    const runMutation = useRunMutation();
    const removeMutation = useRemovePlagiarismMutation();
    const updateMutation = useUpdatePlagiarismMutation(id);
    const showEdit = useShow();
    const notifications = useNotifications();
    const actualSemester = useActualSemester();

    useEffect(() => {
        runMutation.reset();
    }, [id]);

    if (!request.data) {
        return null;
    }

    const handleRun = async () => {
        try {
            notifications.push({
                variant: 'info',
                message: t('plagiarism.runStarted', { name: request.data.name }),
            });
            await runMutation.mutateAsync(request.data.id);
            notifications.push({
                variant: 'success',
                message: t('plagiarism.runSuccess', { name: request.data.name }),
            });
        } catch (e) {
            // Already handled globally
        }
    };

    const handleDelete = async () => {
        try {
            await removeMutation.mutateAsync(request.data);
            history.replace('/instructor/plagiarism');
        } catch (e) {
            // Already handled globally
        }
    };

    const handleEditSave = async (data: Plagiarism) => {
        try {
            await updateMutation.mutateAsync(data);
            showEdit.toHide();
        } catch (e) {
            // Already handled globally
        }
    };

    return (
        <>
            {
                showEdit.show
                    ? (
                        <EditForm
                            editData={request.data}
                            onSave={handleEditSave}
                            onCancel={showEdit.toHide}
                            isLoading={updateMutation.isLoading}
                        />
                    )
                    : (
                        <RequestDetails
                            report={request.data}
                            onDelete={handleDelete}
                            onEdit={showEdit.toShow}
                            isActualSemester={actualSemester.check(request.data.semesterID)}
                        />
                    )
            }

            <Result
                responseURL={request.data.url}
                onRun={handleRun}
                isRunning={runMutation.isLoading}
            />
        </>
    );
}
