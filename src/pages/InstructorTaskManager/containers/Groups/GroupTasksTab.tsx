import { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router';
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faList,
    faTableCells,
    faBolt,
} from '@fortawesome/free-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import { useTranslation } from 'react-i18next';
import { ButtonGroup } from 'react-bootstrap';

import { Group } from '@/resources/instructor/Group';
import { useActualSemester } from '@/hooks/common/SemesterHooks';
import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { GroupTaskListView } from '@/pages/InstructorTaskManager/containers/Groups/GroupTasksListView';
import { GroupTaskGridView } from '@/pages/InstructorTaskManager/containers/Groups/GroupTaskGridView';
import { ToolbarDropdown } from '@/components/Buttons/ToolbarDropdown';
import DropdownItem from 'react-bootstrap/DropdownItem';
import { INSTRUCTOR_TASK_VIEW_LOCAL_STORAGE_KEY } from '@/constants/localStorageKeys';

type Props = {
    group: Group
}

enum View {
    List = 'list',
    Grid = 'grid',
    Quick = 'quick',
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
    const [view, setView] = useState<View>(View.Grid);
    const isMobile = useMediaQuery({ query: 'only screen and (max-width: 768px)' });

    useEffect(() => {
        const value = localStorage.getItem(INSTRUCTOR_TASK_VIEW_LOCAL_STORAGE_KEY);

        // Check if the loaded value is a valid view
        switch (value) {
        case View.List:
        case View.Grid:
            // If it is valid set the new view
            setView(value);
            break;
        case View.Quick:
            // If it is valid set the new view
            setView(value);
            break;
        default:
            if (isMobile) {
                setView(View.List);
            }
            break;
        }
    }, [isMobile]);

    /**
     * Sets the new view and saves it to local storage
     * @param newView
     */
    const handleViewChange = (newView: View) => {
        setView(newView);
        localStorage.setItem(INSTRUCTOR_TASK_VIEW_LOCAL_STORAGE_KEY, newView);
    };

    // Determine the icon based on the current view
    let icon;
    switch (view) {
    case View.List:
        icon = faList;
        break;
    case View.Grid:
        icon = faTableCells;
        break;
    case View.Quick:
        icon = faBolt; // Use the icon for the Quick view
        break;
    default:
        icon = faList; // Fallback icon if needed
        break;
    }

    // Render
    return (
        <>
            <ButtonGroup className="mt-2">
                {actualSemester.check(group.semesterID)
                    ? (
                        <LinkContainer to={`${url}/new-task`}>
                            <ToolbarButton icon={faPlus} text={t('task.newTask')} displayTextBreakpoint="xs" />
                        </LinkContainer>
                    ) : null}
                <ToolbarDropdown
                    text={t('common.view')}
                    displayTextBreakpoint="xs"
                    icon={icon}
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
                    {actualSemester.check(group.semesterID)
                        ? (
                            <DropdownItem onSelect={() => handleViewChange(View.Quick)} active={view === View.Quick}>
                                <FontAwesomeIcon icon={faBolt} />
                                {' '}
                                {t('common.quick')}
                            </DropdownItem>
                        ) : null}
                </ToolbarDropdown>
            </ButtonGroup>
            {view === View.List ? <GroupTaskListView group={group} /> : null}
            {view === View.Grid ? <GroupTaskGridView group={group} /> : null}
            {view === View.Quick && actualSemester.check(group.semesterID)
                ? <GroupTaskGridView group={group} quickgrader />
                : null}
        </>
    );
}
