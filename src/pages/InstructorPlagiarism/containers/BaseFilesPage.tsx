import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { FileListItem } from 'components/FileListItem';
import { FileUpload } from 'components/FileUpload';
import { useCourses } from 'hooks/instructor/CourseHooks';
import {
    useBasefiles,
    useDownloadBasefileMutation,
    useRemoveBasefileMutation,
    useUploadBasefileMutation,
} from 'hooks/instructor/PlagiarismBaseFileHooks';
import { PlagiarismBasefile } from 'resources/instructor/PlagiarismBasefile';
import { getFirstError } from 'utils/getFirstError';

export function BaseFilesPage() {
    const { t } = useTranslation();
    const courses = useCourses(true, true);
    const [selectedCourse, setSelectedCourse] = useState(courses.data ? courses.data[0]?.id : undefined);
    const basefiles = useBasefiles();
    const uploadMutation = useUploadBasefileMutation();
    const downloadMutation = useDownloadBasefileMutation();
    const removeMutation = useRemoveBasefileMutation();
    const uploadDisabled = !courses.data || courses.data.length === 0;

    useEffect(() => {
        if (selectedCourse === undefined) {
            setSelectedCourse(courses.data ? courses.data[0]?.id : undefined);
        }
    }, [courses]);

    const handleUpload = async (files: File[]) => {
        try {
            await uploadMutation.mutateAsync({ courseID: selectedCourse ?? -1, files });
        } catch (e) {
            // Already handled globally
        }
    };

    const handleDownload = (file: PlagiarismBasefile) => {
        downloadMutation.download(file.name, file.id);
    };

    const handleRemove = (file: PlagiarismBasefile) => {
        removeMutation.mutate(file.id);
    };

    const failedToUpload: string[] | undefined = uploadMutation.data
        ?.failed.map((f) => {
            const firstError = getFirstError(f.cause);
            if (firstError) {
                return `${f.name}: ${firstError}`;
            }
            return f.name;
        });

    return (
        <>
            <FileUpload
                multiple
                disableSelect={uploadDisabled}
                disableUpload={uploadDisabled}
                loading={uploadMutation.isLoading}
                onUpload={handleUpload}
                errorMessages={failedToUpload}
                successCount={uploadMutation.data ? uploadMutation.data.uploaded.length : 0}
            >
                <Form.Group>
                    <Form.Label>
                        {t('course.course')}
                        :
                    </Form.Label>
                    <Form.Control
                        as="select"
                        size="sm"
                        disabled={uploadDisabled}
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(parseInt(e.target.value, 10))}
                    >
                        {courses.data?.map((course) => (
                            <option key={course.id} value={course.id}>{course.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
            </FileUpload>
            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>{t('plagiarism.basefiles.basefiles')}</CustomCardTitle>
                </CustomCardHeader>

                <p>{t('plagiarism.basefiles.about')}</p>

                {
                    basefiles.data?.map((file) => (
                        <FileListItem
                            key={file.id}
                            name={file.name}
                            onDownload={() => handleDownload(file)}
                            onRemove={file.deletable ? (() => handleRemove(file)) : undefined}
                        >
                            {file.course?.name}
                        </FileListItem>
                    ))
                }
            </CustomCard>
        </>
    );
}
