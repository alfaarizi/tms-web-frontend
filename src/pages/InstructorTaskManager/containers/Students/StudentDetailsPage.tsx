import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Tab } from 'react-bootstrap';
import { useHistory } from 'react-router';

import {
    useStartCodeCompassMutation,
    useStopCodeCompassMutation,
    useSubmissionsForStudent,
} from 'hooks/instructor/SubmissionHooks';
import { useGroup, useGroupStudents } from 'hooks/instructor/GroupHooks';
import { StudentSolutionsTab } from 'pages/InstructorTaskManager/containers/Students/StudentSolutionsTab';
import { StudentStatsTab } from 'pages/InstructorTaskManager/containers/Students/StudentStatsTab';
import { UserSwitcher } from 'components/UserSwticher';
import { TabbedInterface } from 'components/TabbedInterface';
import { Submission } from 'resources/instructor/Submission';

type Params = {
    groupID: string;
    userID: string;
}

export function StudentDetailsPage() {
    const { t } = useTranslation();

    const params = useParams<Params>();
    const history = useHistory();
    const groupID = parseInt(params.groupID || '-1', 10);
    const selectedUserID = parseInt(params.userID || '-1', 10);

    const submissions = useSubmissionsForStudent(groupID, selectedUserID);
    const students = useGroupStudents(groupID);
    const group = useGroup(groupID);
    const selectedUser = students.data?.find((u) => u.id === selectedUserID);
    const startCodeCompass = useStartCodeCompassMutation(-1);
    const stopCodeCompass = useStopCodeCompassMutation(-1);

    const handleStudentSwitch = (userID: number) => {
        history.push(`./${userID}`);
    };

    const handleStartCodeCompass = async (file: Submission) => {
        try {
            const data: Submission = await startCodeCompass.mutateAsync(file);
            if (data.codeCompass?.port) {
                window.open(`http://${window.location.hostname}:${data.codeCompass.port}/`, '_blank');
            }
        } catch (e) {
            // Already handled globally
        }
    };

    const handleStopCodeCompass = async (file: Submission) => {
        try {
            await stopCodeCompass.mutateAsync(file);
        } catch (e) {
            // Already handled globally
        }
    };

    if (!submissions.data || !students.data || !selectedUser || !group.data) {
        return null;
    }

    return (
        <>
            <UserSwitcher users={students.data} onChange={handleStudentSwitch} selectedID={selectedUserID} />

            <TabbedInterface defaultActiveKey="solutions" id="student-tabs">
                <Tab eventKey="solutions" title={t('task.solutions')}>
                    <StudentSolutionsTab
                        group={group.data}
                        user={selectedUser}
                        handleStartCodeCompass={handleStartCodeCompass}
                        handleStopCodeCompass={handleStopCodeCompass}
                    />
                </Tab>
                <Tab eventKey="stats" title={t('group.stats.stats')}>
                    <StudentStatsTab group={group.data} user={selectedUser} />
                </Tab>
            </TabbedInterface>
        </>
    );
}
