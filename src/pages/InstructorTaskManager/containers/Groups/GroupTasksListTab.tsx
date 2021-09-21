import React from 'react';
import { useRouteMatch } from 'react-router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import { useTranslation } from 'react-i18next';
import { ButtonGroup } from 'react-bootstrap';

import { useTasks } from 'hooks/instructor/TaskHooks';
import { Group } from 'resources/instructor/Group';
import { useActualSemester } from 'hooks/common/SemesterHooks';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { TaskList } from 'pages/InstructorTaskManager/components/Groups/TaskList';

type Props = {
    group: Group
}

/**
 * Lists tasks for the given group
 * @param group
 * @constructor
 */
export function GroupTaskListTab({ group }: Props) {
    const { t } = useTranslation();
    const { url } = useRouteMatch();
    const tasks = useTasks(group.id);
    const actualSemester = useActualSemester();

    // Render
    return (
        <>
            <ButtonGroup className="mt-2">
                {actualSemester.check(group.semesterID) && !group.isCanvasCourse
                    ? (
                        <LinkContainer to={`${url}/new-task`}>
                            <ToolbarButton icon={faPlus} text={t('task.newTask')} />
                        </LinkContainer>
                    ) : null}
            </ButtonGroup>
            <TaskList tasks={tasks.data} />
        </>
    );
}
