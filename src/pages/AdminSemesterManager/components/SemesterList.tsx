import { useState } from 'react';
import { faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { Semester } from '@/resources/common/Semester';
import { SingleColumnLayout } from '@/layouts/SingleColumnLayout';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { ButtonGroup } from 'react-bootstrap';
import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { SemesterListItem } from '@/pages/AdminSemesterManager/components/SemesterListItem';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';

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

    const [confirmDialog, setConfirmDialog] = useState(false);

    const handleAddButton = () => {
        setConfirmDialog(true);
    };

    const onConfirm = () => {
        setConfirmDialog(false);
        onAddNext();
    };

    return (
        <SingleColumnLayout>
            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>{t('common.semesters')}</CustomCardTitle>
                    <ButtonGroup>
                        <ToolbarButton
                            onClick={handleAddButton}
                            icon={faCalendarPlus}
                            text={`${t('common.add')}: ${nextSemester}`}
                        />
                    </ButtonGroup>
                    <ConfirmModal
                        description={t('common.confirmAddSemester')}
                        isConfirmDialogOpen={confirmDialog}
                        onCancel={() => { setConfirmDialog(false); }}
                        onConfirm={onConfirm}
                        title={t('common.areYouSure')}
                    />
                </CustomCardHeader>

                {semesters?.map((semester) => <SemesterListItem key={semester.id} semester={semester} />)}
            </CustomCard>
        </SingleColumnLayout>
    );
}
