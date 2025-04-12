import { useMemo } from 'react';
import { useTasksForGrid } from '@/hooks/instructor/TaskHooks';
import { Group } from '@/resources/instructor/Group';
import { useDownloadAll, useExportSpreadsheet, useGradeMutation } from '@/hooks/instructor/SubmissionHooks';
import { TaskGridTableBody } from '@/pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGridTableBody';
import { TaskGridTableHeader } from '@/pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGridTableHeader';
import { TaskGridTableCard } from '@/pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGridTableCard';
import { GridSubmission } from '@/resources/instructor/GridSubmission';
import { useGroupStudents } from '@/hooks/instructor/GroupHooks';
import { GridTask } from '@/resources/instructor/GridTask.php';
import { User } from '@/resources/common/User';
import {
    TaskQuickGraderTableBody,
} from '@/pages/InstructorTaskManager/components/Groups/TaskGrid/TaskQuickGrader/TaskQuickGraderTableBody';
import { SubmissionGrade } from '@/resources/instructor/SubmissionGrade';

type Props = {
    group: Group,
    quickgrader?: boolean,
};

/**
 * Renders task grid for the given group
 * @param group
 * @constructor
 */
export function GroupTaskGridView({ group, quickgrader = false }: Props) {
    const students = useGroupStudents(group.id);
    const tasks = useTasksForGrid(group.id);
    const exportSpreadsheet = useExportSpreadsheet();
    const downloadAll = useDownloadAll();
    const gradeMutation = useGradeMutation();

    const studentList: User[] = students.data || [];
    const categorizedTasks: GridTask[][] = tasks.data || [];
    const flatTaskList: GridTask[] = useMemo(
        () => categorizedTasks.flat(),
        [categorizedTasks],
    );
    // (taskID, studentID) -> GridSubmission
    const taskFileMap: Map<number, Map<number, GridSubmission>> = useMemo(() => {
        const map = new Map<number, Map<number, GridSubmission>>();
        flatTaskList.forEach((task) => {
            const fileMap = new Map<number, GridSubmission>();
            map.set(task.id, fileMap);
            task.submissions.forEach((file) => {
                fileMap.set(file.uploaderID, file);
            });
        });
        return map;
    }, [flatTaskList]);

    // This function can return undefined, because the studentList and categorizedTasks arrays can be out of sync
    // during query invalidation in mutations.
    const getSubmission = (taskID: number, studentID: number): GridSubmission | undefined => {
        const taskFiles = taskFileMap.get(taskID);
        return taskFiles?.get(studentID);
    };

    /**
     * Saves the grading data by calling the `gradeMutation` mutation.
     *
     * @param data - The grading data to save, including `status`, `grade`, and optional `notes`.
     * @throws Will catch and handle any mutation errors.
     */
    const handleGradeSave = async (data: SubmissionGrade) => {
        try {
            await gradeMutation.mutateAsync(data);
        } catch (e) {
            // Handle error globally
        }
    };

    // Render
    if (!students.isSuccess || !tasks.isSuccess || (studentList.length === 0 && categorizedTasks.length === 0)) {
        return null;
    }

    return (
        <TaskGridTableCard>
            <TaskGridTableHeader
                categorizedTasks={categorizedTasks}
                taskList={flatTaskList}
                onDownloadAll={downloadAll.download}
                onExportSpreadsheet={exportSpreadsheet.download}
            />
            {quickgrader
                ? (
                    <TaskQuickGraderTableBody
                        students={studentList}
                        taskList={flatTaskList}
                        getSubmission={getSubmission}
                        onGradeSave={handleGradeSave} // Pass handleGradeSave as a prop
                    />
                )
                : (
                    <TaskGridTableBody
                        students={studentList}
                        taskList={flatTaskList}
                        getSubmission={getSubmission}
                    />
                )}
        </TaskGridTableCard>
    );
}
