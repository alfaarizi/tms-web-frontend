import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import {
    Button, ButtonGroup, Form, Modal, Spinner,
} from 'react-bootstrap';

import { FormError } from '@/components/FormError';
import { CanvasSetupData } from '@/resources/instructor/CanvasSetupData';
import { CanvasSyncLevel } from '@/resources/instructor/CanvasSyncLevel';
import { useCanvasCourses, useCanvasSections } from '@/hooks/instructor/CanvasHooks';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

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

    // Available sync levels
    const syncLevels = [
        { key: 'group.syncLevels.nameListsAndTasks', value: ['Name lists', 'Tasks'] },
        { key: 'group.syncLevels.nameLists', value: ['Name lists'] },
    ];
    // Current selected sync level
    const [selectedSyncLevel, setSelectedSyncLevel] = useState<{key: string; value: string[]}>(syncLevels[0]);

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

    // Handle sync level selection
    const onSelect = (eventKey: string | null) => {
        const selectedItem = syncLevels.find((item) => item.key === eventKey);
        if (selectedItem) {
            setSelectedSyncLevel(selectedItem);
        }
    };

    // Handle form submit
    const onSubmit = handleSubmit((data) => {
        onSave({
            ...data,
            syncLevel: selectedSyncLevel.value as CanvasSyncLevel[],
        });
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

                    <div className="my-1">
                        <Dropdown
                            as={ButtonGroup}
                            size="sm"
                            onSelect={onSelect}
                        >
                            <Button
                                variant="primary"
                                type="submit"
                                size="sm"
                                disabled={inProgress || courses.isFetching || sections.isFetching}
                            >
                                {inProgress || courses.isFetching || sections.isFetching
                                    ? <Spinner animation="border" size="sm" />
                                    : <FontAwesomeIcon icon={faSave} />}
                                {' '}
                                {t(selectedSyncLevel.key)}
                            </Button>

                            <Dropdown.Toggle
                                split
                                variant="primary"
                                id="dropdown-split-basic"
                                disabled={inProgress || courses.isFetching || sections.isFetching}
                            />

                            <Dropdown.Menu>
                                {syncLevels.map((item) => (
                                    <Dropdown.Item
                                        key={item.key}
                                        eventKey={item.key}
                                        active={item.key === selectedSyncLevel.key}
                                    >
                                        {t(item.key)}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        {onCancel ? (
                            <Button
                                variant="secondary"
                                className="ml-1"
                                size="sm"
                                onClick={onCancel}
                                disabled={inProgress || courses.isFetching || sections.isFetching}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                                {' '}
                                {t('common.cancel')}
                            </Button>
                        ) : null}
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
