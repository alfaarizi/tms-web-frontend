import { Form } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { QuizTest } from 'resources/instructor/QuizTest';
import { FormError } from 'components/FormError';
import { useForm } from 'react-hook-form';
import { FormButtons } from 'components/Buttons/FormButtons';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { Group } from 'resources/instructor/Group';
import { DateTimePickerControl } from 'components/DateTimePickerControl';
import { ValidationErrorBody } from 'exceptions/ServerSideValidationError';
import { useServersideFormErrors } from 'ui-hooks/useServersideFormErrors';
import { useTextPaste } from 'ui-hooks/useTextPaste';

type Props = {
    title: string,
    onSave: (test: QuizTest) => void,
    editData?: QuizTest,
    onCancel?: () => void,
    groups: Group[] | undefined,
    serverSideError?: ValidationErrorBody | null,
    isLoading: boolean
}

export function TestForm({
    title,
    editData,
    onCancel,
    onSave,
    groups,
    serverSideError,
    isLoading,
}: Props) {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        control,
        clearErrors,
        setError,
        setValue,
        watch,

        formState: {
            errors,
        },
    } = useForm<QuizTest>();
    useServersideFormErrors<QuizTest>(clearErrors, setError, serverSideError);

    // Set groupID after page load
    useEffect(() => {
        if (!!groups && groups.length > 0) {
            setValue('groupID', groups[0].id);
        }

        if (editData) {
            setValue('name', editData.name);
            setValue('questionamount', editData.questionamount);
            setValue('availablefrom', editData.availablefrom);
            setValue('availableuntil', editData.availableuntil);
            setValue('groupID', editData.groupID);
            setValue('duration', editData.duration);
            setValue('shuffled', editData.shuffled);
            setValue('unique', editData.unique);
            setValue('password', editData.password);
        }
    }, [groups, editData]);

    const selectedGroupID = watch('groupID');
    // watch('groupID') should return a number, but it returns a string
    // eslint-disable-next-line eqeqeq
    const selectedGroupTimezone = groups?.find((group) => group.id == selectedGroupID)?.timezone || '';

    const handleTextPaste = useTextPaste(setValue);

    const onSubmit = handleSubmit((data) => onSave(data));

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{title}</CustomCardTitle>
            </CustomCardHeader>
            <Form onSubmit={onSubmit}>
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
                        {t('quizTests.questionAmount')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="number"
                        {...register('questionamount', {
                            required: t('common.fieldRequired').toString(),
                        })}
                        size="sm"
                    />
                    {errors.questionamount && <FormError message={errors.questionamount.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('quizTests.availablefrom')}
                        :
                    </Form.Label>
                    <DateTimePickerControl
                        rules={{
                            required: t('common.fieldRequired').toString(),
                        }}
                        control={control}
                        timezone={selectedGroupTimezone}
                        name="availablefrom"
                    />
                    {errors.availablefrom && <FormError message={errors.availablefrom.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('quizTests.availableuntil')}
                        :
                    </Form.Label>
                    <DateTimePickerControl
                        rules={{
                            required: t('common.fieldRequired')
                                .toString(),
                        }}
                        timezone={selectedGroupTimezone}
                        control={control}
                        name="availableuntil"
                    />
                    {errors.availableuntil && <FormError message={errors.availableuntil.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('common.group')}
                        :
                    </Form.Label>
                    <Form.Control as="select" {...register('groupID', { required: true })} size="sm">
                        {
                            groups?.map((group) => <option key={group.id} value={group.id}>{group.number}</option>)
                        }
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('quizTests.duration')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="number"
                        {...register('duration', {
                            required: t('common.fieldRequired')
                                .toString(),
                        })}
                        size="sm"
                    />
                    {errors.duration && <FormError message={errors.duration?.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('login.password')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="text"
                        {...register('password')}
                        size="sm"
                    />
                    {errors.password && <FormError message={errors.password.message} />}
                    <Form.Text className="text-muted">{t('quizTests.passwordProtectedHelp')}</Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        id="shuffled"
                        label={t('quizTests.shuffled')}
                        {...register('shuffled')}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        id="unique"
                        label={t('quizTests.unique')}
                        {...register('unique')}
                    />
                </Form.Group>

                <FormButtons onCancel={onCancel} isLoading={isLoading} />
            </Form>
        </CustomCard>
    );
}
