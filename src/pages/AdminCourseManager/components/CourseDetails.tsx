import React from 'react';
import { useTranslation } from 'react-i18next';

import { Course } from 'resources/common/Course';
import { DataRow } from 'components/DataRow';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { ButtonGroup } from 'react-bootstrap';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

type Props = {
    course: Course,
    onEdit: () => void
}

export function CourseDetails({
    course,
    onEdit,
}: Props) {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>
                    {course.name}
                </CustomCardTitle>
                <ButtonGroup>
                    <ToolbarButton onClick={onEdit} icon={faEdit} text={t('common.edit')} />
                </ButtonGroup>
            </CustomCardHeader>
            <DataRow label="ID">{course.id}</DataRow>
            <DataRow label={t('course.code')}>{course.code}</DataRow>
        </CustomCard>
    );
}
