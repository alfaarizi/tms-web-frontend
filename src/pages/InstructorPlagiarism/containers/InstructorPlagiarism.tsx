import React from 'react';
import {
    Route, Switch, useHistory, useRouteMatch,
} from 'react-router';
import { useTranslation } from 'react-i18next';
import { SideBarLayout } from 'layouts/SideBarLayout';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { faBriefcase, faFileAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { NewRequestPage } from 'pages/InstructorPlagiarism/containers/NewRequestPage';
import { BaseFilesPage } from 'pages/InstructorPlagiarism/containers/BaseFilesPage';
import { usePlagiarismList } from 'hooks/instructor/PlagiarismHooks';
import { RequestPage } from 'pages/InstructorPlagiarism/containers/RequestPage';
import { SideBarItemWithIcon } from 'components/Navigation/SideBarItemWithIcon';
import { useActualSemester, useSelectedSemester } from 'hooks/common/SemesterHooks';

export function InstructorPlagiarism() {
    const history = useHistory();
    const { url } = useRouteMatch();
    const { t } = useTranslation();
    const { check } = useActualSemester();
    const { selectedSemesterID } = useSelectedSemester();
    const plagiarism = usePlagiarismList(selectedSemesterID);

    const handleNewCourseOpen = () => {
        history.push(`${url}/new`);
    };
    const sidebarItems = plagiarism.data?.map((item) => (
        <SideBarItemWithIcon
            key={item.id}
            title={item.name}
            icon={faFileAlt}
            to={`${url}/${item.id}`}
        />
    )) || [];
    sidebarItems.unshift(
        <SideBarItemWithIcon
            key="basefiles"
            title={t('plagiarism.basefiles.basefiles')}
            icon={faBriefcase}
            to={`${url}/basefiles`}
        />,
        <hr />,
    );
    return (
        <SideBarLayout
            sidebarTitle={t('plagiarism.plagiarismCheck')}
            sidebarItems={sidebarItems}
            sidebarButtons={
                check(selectedSemesterID)
                    ? (
                        <ToolbarButton
                            className="float-right"
                            icon={faPlus}
                            text={t('common.add')}
                            onClick={handleNewCourseOpen}
                            displayTextBreakpoint="xs"
                        />
                    )
                    : null
            }
            mainContent={(
                <Switch>
                    <Route path={`${url}/new`} exact>
                        <NewRequestPage />
                    </Route>
                    <Route path={`${url}/basefiles`} exact>
                        <BaseFilesPage />
                    </Route>
                    <Route path={`${url}/:id`}>
                        <RequestPage />
                    </Route>
                </Switch>
            )}
        />
    );
}
