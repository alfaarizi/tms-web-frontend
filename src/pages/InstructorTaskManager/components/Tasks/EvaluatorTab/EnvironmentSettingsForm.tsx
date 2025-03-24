import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Form, Alert, InputGroup } from 'react-bootstrap';
import { DateTime } from 'luxon';

import { Task } from 'resources/instructor/Task';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { FormError } from 'components/FormError';
import { FormButtons } from 'components/Buttons/FormButtons';
import { EvaluatorAdditionalInformation } from 'resources/instructor/EvaluatorAdditionalInformation';
import { faRefresh, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { useFileSizeValidator } from 'hooks/common/useFileSizeValidator';
import { getUserTimezone } from 'utils/getUserTimezone';
import { SetupEvaluatorEnvironment } from 'resources/instructor/SetupEvaluatorEnvironment';

type Props = {
    onSave: (task: SetupEvaluatorEnvironment) => void,
    onUpdateDockerImage: () => void,
    task: Task,
    additionalInformation: EvaluatorAdditionalInformation,
    saveInProgress: boolean,
    updateInProgress: boolean,
    isActualSemester: boolean
}

export function EnvironmentSettingsForm({
    task,
    onSave,
    onUpdateDockerImage,
    additionalInformation,
    saveInProgress,
    updateInProgress,
    isActualSemester,
}: Props) {
    const inProgress = saveInProgress || updateInProgress;
    const { t } = useTranslation();
    const fileSizeValidator = useFileSizeValidator();
    const {
        register,
        handleSubmit,
        setValue,
        watch,

        formState: {
            errors,
        },
    } = useForm<SetupEvaluatorEnvironment>();

    const dockerfileFileValidator = (files: FileList | null) => {
        if (!files) {
            return true;
        }

        return Array.from(files)
            .some((file) => file.name === 'Dockerfile')
            ? fileSizeValidator.reactHookFormsValidator(files)
            : t('fileUpload.hint.atLeastOneDockerfile');
    };

    const handleResetFileUpload = () => {
        setValue('files', null);
    };

    const onSubmit = handleSubmit((data: SetupEvaluatorEnvironment) => {
        onSave(data);
    });

    // Load settings from task data
    useEffect(() => {
        if (task.imageName) {
            setValue('testOS', task.testOS);
            setValue('imageName', task.imageName);
            handleResetFileUpload();
        }
    }, [task.testOS, task.imageName]);

    // Render
    const osOptions = Object.keys(additionalInformation.osMap)
        .map((key: string) => <option key={key} value={key}>{additionalInformation.osMap[key]}</option>);

    let alertToShow;
    if (inProgress) {
        alertToShow = <Alert variant="dark">{t('task.evaluator.inProgress')}</Alert>;
    } else if (additionalInformation.imageSuccessfullyBuilt) {
        const dt = DateTime.fromISO(additionalInformation.imageCreationDate, { zone: getUserTimezone() });
        alertToShow = (
            <Alert variant="success">
                {t('task.evaluator.successfullyBuild', { createdAt: dt.toFormat('yyyy-LL-dd HH:mm:ss') })}
            </Alert>
        );
    } else {
        alertToShow = <Alert variant="info">{t('task.evaluator.builtImageNotFound')}</Alert>;
    }

    const watchFiles = watch('files');
    let fileLabel = ' ';
    if (watchFiles && watchFiles.length > 0) {
        for (let i = 0; i < watchFiles.length; ++i) {
            fileLabel += `${watchFiles[i].name} `;
        }
    }

    const watchImageName = watch('imageName');

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>
                    {t('common.settings')}
                </CustomCardTitle>
            </CustomCardHeader>

            {alertToShow}

            <p>{t('task.evaluator.templateHelp')}</p>

            <hr />

            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>
                        {t('task.evaluator.testOS')}
                        :
                    </Form.Label>
                    <Form.Control
                        as="select"
                        {...register('testOS', {
                            required: t('common.fieldRequired')
                                .toString(),
                        })}
                        size="sm"
                        disabled={inProgress}
                    >
                        {osOptions}
                    </Form.Control>
                    {errors.testOS && <FormError message={errors.testOS.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('task.evaluator.imageName')}
                        :
                    </Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            size="sm"
                            {...register('imageName', {
                                validate: {
                                    imageSet: (v: string | undefined) => {
                                        const valid = (v && v !== '') || (watchFiles && watchFiles.length > 0);
                                        return valid ? true : t('task.evaluator.imageRequired')
                                            .toString();
                                    },
                                },
                            })}
                            disabled={inProgress || (!!watchFiles && watchFiles.length > 0)}
                        />
                        <InputGroup.Append>
                            <ToolbarButton
                                icon={faRefresh}
                                disabled={inProgress || task.imageName !== watchImageName}
                                onClick={onUpdateDockerImage}
                                isLoading={updateInProgress}
                                text={t('task.evaluator.updateImage')}
                            />
                        </InputGroup.Append>
                    </InputGroup>

                    {errors.imageName && <FormError message={errors.imageName.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('task.evaluator.uploadDockerfile')}
                        :
                    </Form.Label>

                    <InputGroup>
                        <InputGroup.Prepend>
                            <ToolbarButton
                                icon={faTimes}
                                onClick={handleResetFileUpload}
                                disabled={inProgress}
                                text={t('common.delete')}
                                displayTextBreakpoint="none"
                            />
                        </InputGroup.Prepend>
                        <Form.File
                            id="dockerfile-upload"
                            data-browse={t('fileUpload.browse')}
                            label={fileLabel}
                            custom
                            multiple
                            disabled={inProgress || !fileSizeValidator.ready}
                            {...register('files', {
                                validate: dockerfileFileValidator,
                            })}
                        />
                    </InputGroup>

                    {errors.files && <FormError message={errors.files.message} />}

                    <Form.Text muted>
                        {t('task.evaluator.uploadDockerfileHelp')}
                    </Form.Text>
                </Form.Group>

                {isActualSemester ? (
                    <FormButtons isLoading={saveInProgress} isDisabled={inProgress} />
                ) : null}
            </Form>
        </CustomCard>
    );
}
