import React, { useMemo } from 'react';
import { useTasksForGrid } from 'hooks/instructor/TaskHooks';

import { Group } from 'resources/instructor/Group';
import { useDownloadAll, useExportSpreadsheet } from 'hooks/instructor/StudentFileHooks';
import { TaskGridTableBody } from 'pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGridTableBody';
import { TaskGridTableHeader } from 'pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGridTableHeader';
import { TaskGridTableCard } from 'pages/InstructorTaskManager/components/Groups/TaskGrid/TaskGridTableCard';
import { GridStudentFile } from 'resources/instructor/GridStudentFile';
import { useGroupStudents } from 'hooks/instructor/GroupHooks';
import { GridTask } from 'resources/instructor/GridTask.php';
import { User } from 'resources/common/User';

type Props = {
    group: Group,
};

/**
 * Renders task grid for the given group
 * @param group
 * @constructor
 */
export function GroupTaskGridView({ group }: Props) {
    const students = useGroupStudents(group.id);
    const tasks = useTasksForGrid(group.id);
    const exportSpreadsheet = useExportSpreadsheet();
    const downloadAll = useDownloadAll();

    const studentList: User[] = students.data || [];
    const categorizedTasks: GridTask[][] = tasks.data || [];
    const flatTaskList: GridTask[] = useMemo(
        () => categorizedTasks.flat(),
        [categorizedTasks],
    );
    // (taskID, studentID) -> GridStudentFile
    const taskFileMap: Map<number, Map<number, GridStudentFile>> = useMemo(() => {
        const map = new Map<number, Map<number, GridStudentFile>>();
        flatTaskList.forEach((task) => {
            const fileMap = new Map<number, GridStudentFile>();
            map.set(task.id, fileMap);
            task.studentFiles.forEach((file) => {
                fileMap.set(file.uploaderID, file);
            });
        });
        return map;
    }, [flatTaskList]);

    // This function can return undefined, because the studentList and categorizedTasks arrays can be out of sync
    // during query invalidation in mutations.
    const getStudentFile = (taskID: number, studentID: number): GridStudentFile | undefined => {
        const taskFiles = taskFileMap.get(taskID);
        return taskFiles?.get(studentID);
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
            <TaskGridTableBody
                students={studentList}
                taskList={flatTaskList}
                getStudentFile={getStudentFile}
            />
        </TaskGridTableCard>
    );
}
