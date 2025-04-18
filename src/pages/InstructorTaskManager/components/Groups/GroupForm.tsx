import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormError } from '@/components/FormError';
import { Group } from '@/resources/instructor/Group';
import { ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { FormButtons } from '@/components/Buttons/FormButtons';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { Course } from '@/resources/common/Course';
import { useServersideFormErrors } from '@/ui-hooks/useServersideFormErrors';
import timezones from '@/i18n/timezones.json';
import { getUserTimezone } from '@/utils/getUserTimezone';
import { DaysOfWeek } from '@/resources/common/DaysOfTheWeek';

type Props = {
    title: string,
    courses?: Course[],
    onSave: (group: Group) => void,
    onCancel?: () => void
    editData?: Group,
    serverSideError: ValidationErrorBody | null,
    isLoading:boolean
}

export function GroupForm({
    title,
    courses,
    onSave,
    onCancel,
    editData,
    serverSideError,
    isLoading,
}: Props) {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,

        formState: {
            errors,
        },
    } = useForm<Group>();
    useServersideFormErrors<Group>(clearErrors, setError, serverSideError);

    useEffect(() => {
        if (!!courses && courses.length > 0) {
            setValue('courseID', courses[0].id);
        }
    }, [courses]);

    useEffect(() => {
        if (editData) {
            setValue('number', editData.number);
            setValue('timezone', editData.timezone);
            setValue('isExamGroup', editData.isExamGroup);
            setValue('day', editData.day);
            setValue('startTime', editData.startTime?.substring(0, 5));
            setValue('roomNumber', editData.roomNumber);
        } else {
            setValue('timezone', getUserTimezone());
        }
    }, [editData]);

    const [hasSchedule, setHasSchedule] = useState(!!editData?.day);

    const onSubmit = handleSubmit(async (data) => {
        const newData = { ...data };
        if (!hasSchedule) {
            newData.day = null;
            newData.startTime = null;
        }
        if (editData) {
            newData.id = editData.id;
        }
        onSave(newData);
    });

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>
                    {title}
                </CustomCardTitle>
            </CustomCardHeader>

            <Form onSubmit={onSubmit}>

                {!editData ? (
                    <Form.Group>
                        <Form.Label>
                            {t('course.course')}
                            :
                        </Form.Label>
                        <Form.Control
                            as="select"
                            {...register('courseID', {
                                required: t('group.courseIDRequired').toString(),
                            })}
                            size="sm"
                        >
                            {courses?.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
                        </Form.Control>
                        {errors.courseID && <FormError message={errors.courseID.message} />}
                    </Form.Group>
                ) : null}

                <Form.Group>
                    <Form.Label>
                        {t('group.number')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="number"
                        min="1"
                        {...register('number', {
                            required: false,
                            min: 1,
                        })}
                        size="sm"
                    />
                    {errors.number && <FormError message={errors.number.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('common.timezone')}
                        :
                    </Form.Label>
                    <Form.Control as="select" size="sm" {...register('timezone', { required: true })}>
                        {
                            timezones.map((timezone) => <option key={timezone} value={timezone}>{timezone}</option>)
                        }
                    </Form.Control>
                    {errors.timezone && <FormError message={errors.timezone.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        id="groupForm-hasSchedule"
                        label={t('group.hasSchedule')}
                        checked={hasSchedule}
                        onChange={(e) => setHasSchedule(e.target.checked)}
                    />
                </Form.Group>

                {hasSchedule ? (
                    <>
                        <Form.Group>
                            <Form.Label>
                                {t('group.day')}
                                :
                            </Form.Label>
                            <Form.Control
                                size="sm"
                                as="select"
                                {...register('day', {
                                    required: hasSchedule
                                        ? t('group.dayRequired').toString()
                                        : false,
                                })}
                            >
                                {Object.entries(DaysOfWeek)
                                    .filter(([_, value]) => typeof value === 'number')
                                    .map(([key, value]) => (
                                        <option key={value} value={value}>
                                            {t(`days.${key.toLowerCase()}`)}
                                        </option>
                                    ))}
                            </Form.Control>
                            {errors.day && <FormError message={errors.day.message} />}
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>
                                {t('group.startTime')}
                                :
                            </Form.Label>
                            <Form.Control
                                type="time"
                                {...register('startTime', {
                                    required: hasSchedule
                                        ? t('group.startTimeRequired').toString()
                                        : false,
                                })}
                                size="sm"
                            />
                            {errors.startTime && <FormError message={errors.startTime.message} />}
                        </Form.Group>
                    </>
                ) : null}

                <Form.Group>
                    <Form.Label>
                        {t('group.roomNumber')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="text"
                        {...register('roomNumber', {
                            required: false,
                        })}
                        size="sm"
                    />
                    {errors.roomNumber && <FormError message={errors.roomNumber.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        id="groupForm-isExamGroup"
                        label={t('group.examGroup')}
                        {...register('isExamGroup')}
                    />
                    <Form.Text className="text-muted">
                        {t('group.examGroupHelp')}
                    </Form.Text>
                </Form.Group>

                <FormButtons onCancel={onCancel} isLoading={isLoading} />
            </Form>
        </CustomCard>
    );
}
