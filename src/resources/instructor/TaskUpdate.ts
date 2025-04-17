import { Task } from '@/resources/instructor/Task';
import { TaskUpdateOptions } from '@/resources/instructor/TaskUpdateOptions';

export interface TaskUpdate {
    task: Task;
    options: TaskUpdateOptions;
}
