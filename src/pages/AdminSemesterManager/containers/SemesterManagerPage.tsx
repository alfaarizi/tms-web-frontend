import { useSemesters } from '@/hooks/common/SemesterHooks';
import { useAddNextSemesterMutation, useNextSemester } from '@/hooks/admin/SemesterHooks';
import { SemesterList } from '@/pages/AdminSemesterManager/components/SemesterList';

export function SemesterManagerPage() {
    const semesters = useSemesters();
    const nextSemester = useNextSemester();
    const addNextSemesterMutation = useAddNextSemesterMutation();

    const handleAdd = () => {
        addNextSemesterMutation.mutate();
    };

    return (
        <SemesterList
            semesters={semesters.data}
            nextSemester={nextSemester.data?.name}
            onAddNext={handleAdd}
        />
    );
}
