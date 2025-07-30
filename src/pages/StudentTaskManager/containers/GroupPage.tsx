import { Breadcrumb } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import { useTasks } from '@/hooks/student/TaskHooks';
import { useGroup } from '@/hooks/student/GroupHooks';
import { GroupDetails } from '@/pages/StudentTaskManager/components/GroupDetails';
import { TaskCategories } from '@/pages/StudentTaskManager/components/TaskCategories';
import { useTranslation } from 'react-i18next';
import { StickyBreadcrumb } from '@/components/Header/StickyBreadcrumb';

type Params = {
    id?: string
}

export function GroupPage() {
    const params = useParams<Params>();
    const history = useHistory();
    const { t } = useTranslation();
    const groupID = parseInt(params.id ? params.id : '-1', 10);
    const tasks = useTasks(groupID);
    const group = useGroup(groupID);

    const selectTask = (id: number) => {
        history.push(`../tasks/${id}`);
    };

    if (!group.data || !tasks.data) {
        return null;
    }

    return (
        <>
            <StickyBreadcrumb>
                <LinkContainer to="/student/task-manager">
                    <Breadcrumb.Item>{t('navbar.taskmanager')}</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to={`/student/task-manager/groups/${group.data.id}`}>
                    <Breadcrumb.Item active>{`${group.data.course.name} (#${group.data.number})`}</Breadcrumb.Item>
                </LinkContainer>
            </StickyBreadcrumb>
            <GroupDetails group={group.data} />
            <TaskCategories tasks={tasks.data} onTaskClick={selectTask} />
        </>
    );
}
