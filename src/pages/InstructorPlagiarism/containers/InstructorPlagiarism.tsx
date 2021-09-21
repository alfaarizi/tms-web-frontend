import React from 'react';
import {
    Route, Switch, useHistory, useRouteMatch,
} from 'react-router';
import { useTranslation } from 'react-i18next';
import { SideBarLayout } from 'layouts/SideBarLayout';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { faFileAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { NewRequestPage } from 'pages/InstructorPlagiarism/containers/NewRequestPage';
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
    return (
        <SideBarLayout
            sidebarTitle={t('plagiarism.plagiarismCheck')}
            sidebarItems={
                plagiarism.data?.map((item) => (
                    <SideBarItemWithIcon
                        key={item.id}
                        title={item.name}
                        icon={faFileAlt}
                        to={`${url}/${item.id}`}
                    />
                )) || []
            }
            sidebarButtons={
                check(selectedSemesterID)
                    ? (
                        <ToolbarButton
                            className="float-right"
                            icon={faPlus}
                            text={t('common.add')}
                            onClick={handleNewCourseOpen}
                        />
                    )
                    : null
            }
            mainContent={(
                <Switch>
                    <Route path={`${url}/new`} exact>
                        <NewRequestPage />
                    </Route>
                    <Route path={`${url}/:id`}>
                        <RequestPage />
                    </Route>
                </Switch>
            )}
        />
    );
}
