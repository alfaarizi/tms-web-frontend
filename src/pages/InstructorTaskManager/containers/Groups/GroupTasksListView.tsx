import { useTasks } from '@/hooks/instructor/TaskHooks';
import { Group } from '@/resources/instructor/Group';
import { TaskList } from '@/pages/InstructorTaskManager/components/Groups/TaskList';

type Props = {
    group: Group
}

/**
 * Lists tasks for the given group
 * @param group
 * @constructor
 */
export function GroupTaskListView({ group }: Props) {
    const tasks = useTasks(group.id);

    // Render
    return <TaskList tasks={tasks.data} />;
}
