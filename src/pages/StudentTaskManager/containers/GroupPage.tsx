import { useHistory, useParams } from 'react-router';

import { useTasks } from '@/hooks/student/TaskHooks';
import { useGroup } from '@/hooks/student/GroupHooks';
import { GroupDetails } from '@/pages/StudentTaskManager/components/GroupDetails';
import { TaskCategories } from '@/pages/StudentTaskManager/components/TaskCategories';

type Params = {
    id?: string
}

export function GroupPage() {
    const params = useParams<Params>();
    const history = useHistory();
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
            <GroupDetails group={group.data} />
            <TaskCategories tasks={tasks.data} onTaskClick={selectTask} />
        </>
    );
}
