import React from 'react';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { TaskListItem } from 'pages/StudentTaskManager/components/TaskListItem';
import { Task } from 'resources/student/Task';

type Props = {
    tasks: Task[][],
    onTaskClick: (id: number) => void
}

export function TaskCategories({
    tasks,
    onTaskClick,
}: Props) {
    return (
        <>
            {
                tasks.map((category) => {
                    if (category.length > 0) {
                        return (
                            <CustomCard key={category[0].category}>
                                <CustomCardHeader>
                                    <CustomCardTitle>{category[0].translatedCategory}</CustomCardTitle>
                                </CustomCardHeader>
                                {category.map((task) => (
                                    <TaskListItem
                                        task={task}
                                        key={task.id}
                                        onClick={onTaskClick}
                                    />
                                ))}
                            </CustomCard>
                        );
                    }
                    return null;
                })
            }
        </>
    );
}
