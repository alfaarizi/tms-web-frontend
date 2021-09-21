import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';

import { SingleColumnLayout } from 'layouts/SingleColumnLayout';
import { HomePage } from 'pages/InstructorExamination/containers/HomePage';
import { NewQuestionSetPage } from 'pages/InstructorExamination/containers/QuestionSets/NewQuestionSetPage';
import { QuestionSetPage } from 'pages/InstructorExamination/containers/QuestionSets/QuestionSetPage';
import { NewTestPage } from 'pages/InstructorExamination/containers/Tests/NewTestPage';
import { TestPage } from 'pages/InstructorExamination/containers/Tests/TestPage';

export default function InstructorExamination() {
    const { url } = useRouteMatch();

    return (
        <SingleColumnLayout>
            <Switch>
                <Route path={`${url}/question-sets/new`} exact>
                    <NewQuestionSetPage />
                </Route>
                <Route path={`${url}/question-sets/:questionsetID/create-test`}>
                    <NewTestPage />
                </Route>
                <Route path={`${url}/question-sets/:id`}>
                    <QuestionSetPage />
                </Route>
                <Route path={`${url}/tests/:id`}>
                    <TestPage />
                </Route>
                <Route path={`${url}/`} exact>
                    <HomePage />
                </Route>
            </Switch>
        </SingleColumnLayout>
    );
}
