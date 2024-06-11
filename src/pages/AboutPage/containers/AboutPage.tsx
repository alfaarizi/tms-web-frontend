import React from 'react';
import { SingleColumnLayout } from 'layouts/SingleColumnLayout';
import { useTranslation } from 'react-i18next';
import { ProjectInformation } from 'pages/AboutPage/components/ProjectInformation';
import { IssueBoard } from 'pages/AboutPage/components/IssueBoard';
import { Changelog } from 'pages/AboutPage/components/Changelog';
import { Credits } from 'pages/AboutPage/components/Credits';

export function AboutPage() {
    const { t } = useTranslation();

    return (
        <SingleColumnLayout>
            <div className="mt-5 w-75 mx-auto">
                <h1>{t('aboutPage.about')}</h1>
                <ProjectInformation />
                <IssueBoard />
                <Changelog />
                <Credits />
            </div>
        </SingleColumnLayout>
    );
}
