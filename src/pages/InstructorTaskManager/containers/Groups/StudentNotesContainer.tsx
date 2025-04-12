import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useShow } from '@/ui-hooks/useShow';
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { useGroupStudentNotes, useGroupStudentNotesMutation } from '@/hooks/instructor/GroupHooks';
import { Breakpoint } from '@/components/Buttons/ResponsiveButtonText';
import { StudentNotes } from '@/resources/instructor/StudentNotes';
import { StudentNotesModal } from '@/pages/InstructorTaskManager/components/Students/StudentNotesModal';
import { User } from '@/resources/common/User';

type Props = {
    groupId: number,
    student: User,
    studentId: number,
    isActualSemester: boolean,
    displayTextBreakpoint?: Breakpoint,
    disabled?: boolean,
}

export function StudentNotesContainer({
    groupId,
    studentId,
    student,
    isActualSemester,
    displayTextBreakpoint,
    disabled,
}: Props) {
    const { t } = useTranslation();
    const show = useShow();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const {
        data,
        refetch,
    } = useGroupStudentNotes(groupId, studentId, false);
    const addMutation = useGroupStudentNotesMutation(groupId, studentId);
    const onClick = async () => {
        setIsLoading(true);
        try {
            await refetch({ throwOnError: true });
            show.toShow();
        } catch (e) {
            setIsError(true);
        }
        setIsLoading(false);
    };
    const onSubmit = async (noteData: StudentNotes) => {
        await addMutation.mutateAsync(noteData.notes);
        show.toHide();
    };
    return isError
        ? (
            <>
                <ToolbarButton
                    onClick={onClick}
                    icon={faNoteSticky}
                    text={t('group.notes')}
                    displayTextBreakpoint={displayTextBreakpoint}
                    isLoading={isLoading}
                    disabled={disabled}
                />
                <StudentNotesModal
                    isActualSemester={isActualSemester}
                    student={student}
                    show={show}
                    submit={onSubmit}
                    data={data}
                />
            </>
        ) : null;
}
