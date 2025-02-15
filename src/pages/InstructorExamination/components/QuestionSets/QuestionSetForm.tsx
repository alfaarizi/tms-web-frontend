import { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { QuizQuestionSet } from '@/resources/instructor/QuizQuestionSet';
import { FormError } from '@/components/FormError';
import { FormButtons } from '@/components/Buttons/FormButtons';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { Course } from '@/resources/common/Course';
import { useTextPaste } from '@/ui-hooks/useTextPaste';

type Props = {
    title: string,
    courses?: Course[],
    onSave: (set: QuizQuestionSet) => void,
    onCancel?: () => void,
    editData?: QuizQuestionSet,
    isLoading:boolean
}

export function QuestionSetForm({
    title,
    courses,
    editData,
    onCancel,
    onSave,
    isLoading,
}: Props) {
    const { t } = useTranslation();
    const {
        register,
        setValue,
        handleSubmit,

        formState: {
            errors,
        },
    } = useForm<QuizQuestionSet>();

    useEffect(() => {
        if (!!courses && courses.length > 0) {
            setValue('courseID', courses[0].id);
        }

        if (editData) {
            setValue('courseID', editData.courseID);
            setValue('name', editData.name);
        }
    }, [courses, editData]);

    const handleTextPaste = useTextPaste(setValue);

    const obSubmit = handleSubmit((data) => {
        onSave(data);
    });

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{title}</CustomCardTitle>
            </CustomCardHeader>
            <Form onSubmit={obSubmit}>
                <Form.Group>
                    <Form.Label>
                        {t('common.name')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="text"
                        {...register('name', {
                            required: t('common.fieldRequired').toString(),
                        })}
                        size="sm"
                        onPaste={handleTextPaste}
                    />
                    {errors.name && <FormError message={errors.name.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('course.course')}
                        :
                    </Form.Label>
                    <Form.Control as="select" {...register('courseID', { required: true })} size="sm">
                        {courses?.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.name}
                            </option>
                        ))}
                    </Form.Control>
                    {errors.courseID && <FormError message={t('group.courseIDRequired')} />}
                </Form.Group>

                <FormButtons onCancel={onCancel} isLoading={isLoading} />
            </Form>
        </CustomCard>
    );
}
