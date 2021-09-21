import React from 'react';
import { faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { Semester } from 'resources/common/Semester';
import { SingleColumnLayout } from 'layouts/SingleColumnLayout';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { ButtonGroup } from 'react-bootstrap';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { SemesterListItem } from 'pages/AdminSemesterManager/components/SemesterListItem';

type Props = {
    semesters?: Semester[],
    nextSemester?: string,
    onAddNext: () => void
}

export function SemesterList({
    semesters,
    nextSemester,
    onAddNext,
}: Props) {
    const { t } = useTranslation();

    return (
        <SingleColumnLayout>
            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>{t('common.semesters')}</CustomCardTitle>
                    <ButtonGroup>
                        <ToolbarButton
                            onClick={onAddNext}
                            icon={faCalendarPlus}
                            text={`${t('common.add')}: ${nextSemester}`}
                        />
                    </ButtonGroup>
                </CustomCardHeader>

                {semesters?.map((semester) => <SemesterListItem key={semester.id} semester={semester} />)}
            </CustomCard>
        </SingleColumnLayout>
    );
}
