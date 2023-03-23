import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import {
    ButtonGroup,
    Form,
} from 'react-bootstrap';

import { Task } from 'resources/instructor/Task';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { FormError } from 'components/FormError';
import { FormButtons } from 'components/Buttons/FormButtons';
import { EvaluatorAdditionalInformation } from 'resources/instructor/EvaluatorAdditionalInformation';
import { SetupAutoTester } from 'resources/instructor/SetupAutoTester';

type Props = {
    onSave: (task: SetupAutoTester) => void,
    task: Task,
    additionalInformation: EvaluatorAdditionalInformation,
    saveInProgress: boolean,
    updateInProgress: boolean,
    isActualSemester: boolean
}

export function AutoTesterSettingsForm({
    task,
    onSave,
    additionalInformation,
    saveInProgress,
    updateInProgress,
    isActualSemester,
}: Props) {
    const inProgress = saveInProgress || updateInProgress;
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        setValue,
        watch,

        formState: {
            errors,
        },
    } = useForm<SetupAutoTester>();

    // Load settings from task data
    useEffect(() => {
        setValue('autoTest', !!task.autoTest);
        setValue('appType', task.appType || '');
        setValue('port', task.port);
        setValue('compileInstructions', task.compileInstructions);
        setValue('runInstructions', task.runInstructions || '');
        setValue('showFullErrorMsg', !!task.showFullErrorMsg);
    }, [
        task.autoTest,
        task.appType,
        task.port,
        task.compileInstructions,
        task.runInstructions,
        task.showFullErrorMsg,
    ]);

    const onSubmit = handleSubmit((data: SetupAutoTester) => {
        onSave(data);
    });

    const appTypeOptions = additionalInformation.appTypes
        .map((val: string) => <option key={val} value={val}>{t(`task.evaluator.appTypes.${val}`)}</option>);

    const watchAppType = watch('appType');

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>
                    {t('common.settings')}
                </CustomCardTitle>
            </CustomCardHeader>

            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        id="activateAutoTester"
                        label={t('task.evaluator.activateAutoTester')}
                        {...register('autoTest')}
                        disabled={inProgress}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('task.evaluator.appType')}
                        :
                    </Form.Label>
                    <Form.Control
                        as="select"
                        {...register('appType', {
                            required: t('common.fieldRequired')
                                .toString(),
                        })}
                        size="sm"
                        disabled={inProgress}
                    >
                        {appTypeOptions}
                    </Form.Control>
                    {errors.appType && <FormError message={errors.appType.message} />}
                </Form.Group>

                {watchAppType === 'Web' && (
                    <Form.Group>
                        <Form.Label>
                            {t('task.evaluator.port')}
                            :
                        </Form.Label>
                        <Form.Control
                            type="number"
                            {...register('port', {
                                valueAsNumber: true,
                                required: t('common.fieldRequired').toString(),
                                min: {
                                    value: 1,
                                    message: t('common.minValueRequired', { value: 1 }).toString(),
                                },
                                max: {
                                    value: 65353,
                                    message: t('common.maxValueRequired', { value: 65353 }).toString(),
                                },
                            })}
                            size="sm"
                            disabled={inProgress}
                        />
                        <Form.Text>
                            {t('task.evaluator.portHint')}
                        </Form.Text>
                        {errors.port && <FormError message={errors.port.message} />}
                    </Form.Group>
                )}

                <Form.Group>
                    <Form.Label>
                        {t('task.evaluator.compileInstructions')}
                        :
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        {...register('compileInstructions')}
                        size="sm"
                        disabled={inProgress}
                        rows={7}
                    />
                    {errors.compileInstructions && <FormError message={errors.compileInstructions.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('task.evaluator.runInstructions')}
                        :
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        {...register('runInstructions')}
                        size="sm"
                        disabled={inProgress}
                        rows={3}
                    />
                    <Form.Text muted>
                        {t(watchAppType === 'Web'
                            ? 'task.evaluator.runWebAppInstructionsHelp'
                            : 'task.evaluator.runInstructionsHelp')}
                    </Form.Text>
                    {errors.runInstructions && <FormError message={errors.runInstructions.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        id="autoTestShowFullErrorMsg"
                        label={t('task.evaluator.showFullErrorMsg')}
                        {...register('showFullErrorMsg')}
                        disabled={inProgress}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        id="autoTestReevaluateSolutions"
                        label={t('task.evaluator.reevaluate')}
                        {...register('reevaluateAutoTest')}
                        disabled={inProgress}
                    />
                </Form.Group>

                {isActualSemester ? (
                    <ButtonGroup>
                        <FormButtons isLoading={saveInProgress} isDisabled={inProgress} />
                    </ButtonGroup>
                ) : null}
            </Form>
        </CustomCard>
    );
}
