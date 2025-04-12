import { Task } from '@/resources/instructor/Task';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { TaskListItem } from '@/pages/InstructorTaskManager/components/Groups/TaskListItem';

type Props = {
    tasks?: Task[][]
}

export function TaskList({ tasks }: Props) {
    return (
        <>
            {
                tasks?.map((category) => {
                    if (category.length > 0) {
                        return (
                            <CustomCard key={category[0].category}>
                                <CustomCardHeader>
                                    <CustomCardTitle>{category[0].translatedCategory}</CustomCardTitle>
                                </CustomCardHeader>
                                {category.map((task) => <TaskListItem task={task} key={task.id} />)}
                            </CustomCard>
                        );
                    }
                    return null;
                })
            }
        </>
    );
}
