import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faList, faTableCells } from '@fortawesome/free-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import { useTranslation } from 'react-i18next';
import { ButtonGroup } from 'react-bootstrap';

import { Group } from 'resources/instructor/Group';
import { useActualSemester } from 'hooks/common/SemesterHooks';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { GroupTaskListView } from 'pages/InstructorTaskManager/containers/Groups/GroupTasksListView';
import { GroupTaskGridView } from 'pages/InstructorTaskManager/containers/Groups/GroupTaskGridView';
import { ToolbarDropdown } from 'components/Buttons/ToolbarDropdown';
import DropdownItem from 'react-bootstrap/DropdownItem';

type Props = {
    group: Group
}

enum View {
    List = 'list',
    Grid = 'grid',
}

/**
 * Displays task list or task grid for the given group
 * @param group
 * @constructor
 */
export function GroupTasksTab({ group }: Props) {
    const { t } = useTranslation();
    const { url } = useRouteMatch();
    const actualSemester = useActualSemester();
    const [view, setView] = useState<View>(View.List);

    useEffect(() => {
        const value = localStorage.getItem('instructorTaskView');

        // Check if the loaded value is a valid view
        switch (value) {
        case View.List:
        case View.Grid:
            // If it is valid set the new view
            setView(value);
            break;
        default:
            break;
        }
    }, []);

    /**
     * Sets the new view and saves it to local storage
     * @param newView
     */
    const handleViewChange = (newView: View) => {
        setView(newView);
        localStorage.setItem('instructorTaskView', newView);
    };

    // Render
    return (
        <>
            <ButtonGroup className="mt-2">
                {actualSemester.check(group.semesterID) && !group.isCanvasCourse
                    ? (
                        <LinkContainer to={`${url}/new-task`}>
                            <ToolbarButton icon={faPlus} text={t('task.newTask')} displayTextBreakpoint="xs" />
                        </LinkContainer>
                    ) : null}
                <ToolbarDropdown
                    text={t('common.view')}
                    displayTextBreakpoint="xs"
                    icon={view === View.List ? faList : faTableCells}
                >
                    <DropdownItem onSelect={() => handleViewChange(View.List)} active={view === View.List}>
                        <FontAwesomeIcon icon={faList} />
                        {' '}
                        {t('common.list')}
                    </DropdownItem>
                    <DropdownItem onSelect={() => handleViewChange(View.Grid)} active={view === View.Grid}>
                        <FontAwesomeIcon icon={faTableCells} />
                        {' '}
                        {t('common.grid')}
                    </DropdownItem>
                </ToolbarDropdown>
            </ButtonGroup>
            {view === View.List ? <GroupTaskListView group={group} /> : <GroupTaskGridView group={group} />}
        </>
    );
}
