import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';

import { SingleColumnLayout } from 'layouts/SingleColumnLayout';
import { HomePage } from 'pages/StudentExamination/containers/HomePage';
import { TestInstancePage } from 'pages/StudentExamination/containers/TestInstancePage';
import { TestWriterPage } from 'pages/StudentExamination/containers/TestWriterPage';
import { VerifyTestPage } from 'pages/StudentExamination/containers/VerifyTestPage';

export default function StudentExamination() {
    const { url } = useRouteMatch();

    return (
        <SingleColumnLayout>
            <Switch>
                <Route path={`${url}/test-instances/:id/writer`}>
                    <TestWriterPage />
                </Route>
                <Route path={`${url}/test-instances/:id/unlock`}>
                    <VerifyTestPage />
                </Route>
                <Route path={`${url}/test-instances/:id`}>
                    <TestInstancePage />
                </Route>
                <Route path={`${url}/`} exact>
                    <HomePage />
                </Route>
            </Switch>
        </SingleColumnLayout>
    );
}
