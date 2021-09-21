import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Form, Modal } from 'react-bootstrap';

import { FormError } from 'components/FormError';
import { FormButtons } from 'components/Buttons/FormButtons';
import { CanvasSetupData } from 'resources/instructor/CanvasSetupData';
import { useCanvasCourses, useCanvasSections } from 'hooks/instructor/CanvasHooks';

type Props = {
    show: boolean,
    inProgress: boolean,
    onSave: (data: CanvasSetupData) => void,
    onCancel: () => void
}

/**
 * Displays Canvas setup form and modal
 * @constructor
 */
export function SetupCanvasModal({
    show, onSave, onCancel, inProgress,
}: Props) {
    const { t } = useTranslation();
    const {
        handleSubmit,
        register,
        setValue,
        watch,

        formState: {
            errors,
        },
    } = useForm<CanvasSetupData>({
        defaultValues: {
            canvasCourse: -1,
            canvasSection: -1,
        },
    });
    // Watch canvasCourse value
    const watchCourseID = watch('canvasCourse');
    // Load courses if modal is displayed. Refetch is manually called after model open.
    const courses = useCanvasCourses(false, false);
    // Sections Query is disabled by default. Refetch is manually called after courseID has changed.
    const sections = useCanvasSections(watchCourseID, false, false);

    // Update course value, if data has changed
    useEffect(() => {
        if (show) {
            courses.refetch({ throwOnError: false }).then((res) => {
                if (res.data && res.data.length > 0) {
                    setValue('canvasCourse', res.data[0].id);
                }
            });
        }
    }, [show]);

    // Refetch sections if courseID has changed
    useEffect(() => {
        if (watchCourseID > -1) {
            // If courseID is valid, then refetch sections
            sections.refetch({ throwOnError: false }).then((res) => {
                // If the returned array is not empty, select the first item from the array
                if (res.data && res.data.length > 0) {
                    setValue('canvasSection', res.data[0].id);
                }
            });
        }
    }, [watchCourseID]);

    // Handle form submit
    const onSubmit = handleSubmit((data) => {
        onSave(data);
    });

    // Render modal
    return (
        <Modal show={show} onHide={onCancel} animation size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{t('group.canvasSync')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Label>
                            {t('group.canvasCourse')}
                            :
                        </Form.Label>
                        <Form.Control
                            as="select"
                            {...register('canvasCourse', { required: true })}
                            size="sm"
                            disabled={courses.isFetching}
                        >
                            {courses.data
                                ?.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
                        </Form.Control>
                        {courses.isFetching ? <p>{t('group.waitingForCanvas')}</p> : null}
                        {errors.canvasCourse && <FormError message={errors.canvasCourse.message} />}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            {t('group.canvasSection')}
                            :
                        </Form.Label>
                        <Form.Control
                            as="select"
                            {...register('canvasSection', { required: true })}
                            size="sm"
                            disabled={sections.isFetching}
                        >
                            {sections.data?.map((section) => (
                                <option key={section.id} value={section.id}>
                                    {section.name}
                                    {section.totalStudents !== null && section.totalStudents !== undefined
                                        ? ` (${t('group.studentCount', { count: section.totalStudents })})`
                                        : ''}
                                </option>
                            ))}
                        </Form.Control>
                        {sections.isFetching ? <p>{t('group.waitingForCanvas')}</p> : null}
                        {errors.canvasSection && <FormError message={errors.canvasSection.message} />}
                    </Form.Group>

                    <FormButtons
                        onCancel={onCancel}
                        isLoading={inProgress || courses.isFetching || sections.isFetching}
                    />
                </Form>
            </Modal.Body>
        </Modal>
    );
}
