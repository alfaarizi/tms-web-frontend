import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import {
    ButtonGroup, Form, Alert, InputGroup, Button, Spinner,
} from 'react-bootstrap';

import { Task } from 'resources/instructor/Task';
import { CustomCard } from 'components/CustomCard/CustomCard';
import { CustomCardHeader } from 'components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from 'components/CustomCard/CustomCardTitle';
import { FormError } from 'components/FormError';
import { FormButtons } from 'components/Buttons/FormButtons';
import { TesterFormData } from 'resources/instructor/TesterFormData';
import DropdownItem from 'react-bootstrap/DropdownItem';
import { TesterTemplate } from 'resources/instructor/TesterTemplate';
import { ToolbarDropdown } from 'components/Buttons/ToolbarDropdown';
import { faClipboardList, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SetupTester } from 'resources/instructor/SetupTester';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { useFileSizeValidator } from 'ui-hooks/useFileSizeValidator';
import { DateTime } from 'luxon';
import { getUserTimezone } from '../../../../utils/getUserTimezone';

type Props = {
    onSave: (task: SetupTester) => void,
    onUpdateDockerImage: () => void,
    task: Task,
    formData: TesterFormData,
    saveInProgress: boolean,
    updateInProgress: boolean,
    isActualSemester: boolean
}

export function AutoTesterForm({
    task,
    onSave,
    onUpdateDockerImage,
    formData,
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
    } = useForm<SetupTester>();

    const handleResetFileUpload = () => {
        setValue('files', null);
    };

    useEffect(() => {
        if (task.imageName) {
            setValue('testOS', task.testOS);
            setValue('appType', task.appType || '');
            setValue('port', task.port);
            setValue('imageName', task.imageName);
            setValue('compileInstructions', task.compileInstructions);
            setValue('runInstructions', task.runInstructions || '');
            setValue('showFullErrorMsg', task.showFullErrorMsg === 1);
            setValue('reevaluateAutoTest', task.reevaluateAutoTest === 1);
            handleResetFileUpload();
        }
    }, [task.imageName]);

    const onSubmit = handleSubmit((data: SetupTester) => {
        onSave(data);
    });

    const handleSetTemplate = (template: TesterTemplate) => {
        setValue('testOS', template.os);
        setValue('imageName', template.image);
        setValue('appType', template.appType);
        setValue('compileInstructions', template.compileInstructions);
        setValue('runInstructions', template.runInstructions);
        setValue('port', template.port);

        handleResetFileUpload();
    };

    // Render
    const osOptions = Object.keys(formData.osMap)
        .map((key: string) => <option key={key} value={key}>{formData.osMap[key]}</option>);

    const appTypeOptions = formData.appTypes
        .map((val: string) => <option key={val} value={val}>{t(`task.autoTester.appTypes.${val}`)}</option>);

    let alertToShow;
    if (inProgress) {
        alertToShow = <Alert variant="dark">{t('task.autoTester.inProgress')}</Alert>;
    } else if (formData.imageSuccessfullyBuilt) {
        const dt = DateTime.fromISO(formData.imageCreationDate, { zone: getUserTimezone() });
        alertToShow = (
            <Alert variant="success">
                {t('task.autoTester.successfullyBuild', { createdAt: dt.toFormat('yyyy-LL-dd HH:mm:ss') })}
            </Alert>
        );
    } else {
        alertToShow = <Alert variant="info">{t('task.autoTester.builtImageNotFound')}</Alert>;
    }

    const watchFiles = watch('files');
    let fileLabel = ' ';
    if (watchFiles && watchFiles.length > 0) {
        for (let i = 0; i < watchFiles.length; ++i) {
            fileLabel += `${watchFiles[i].name} `;
        }
    }

    const watchImageName = watch('imageName');
    const watchAppType = watch('appType');

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>
                    {t('common.settings')}
                </CustomCardTitle>
                <ButtonGroup>
                    <ToolbarDropdown
                        text={t('task.autoTester.templates')}
                        icon={faClipboardList}
                        disabled={inProgress}
                    >
                        {formData.templates.map((template) => (
                            <DropdownItem
                                key={template.name}
                                onSelect={() => handleSetTemplate(template)}
                            >
                                {template.name}
                            </DropdownItem>
                        ))}
                    </ToolbarDropdown>
                </ButtonGroup>
            </CustomCardHeader>

            {!isActualSemester ? <Alert variant="warning">{t('task.autoTester.previousSemesterInfo')}</Alert> : null}
            {alertToShow}

            <p>{t('task.autoTester.templateHelp')}</p>

            <hr />

            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>
                        {t('task.autoTester.testOS')}
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
                        {t('task.autoTester.appType')}
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
                            {t('task.autoTester.port')}
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
                            {t('task.autoTester.portHint')}
                        </Form.Text>
                        {errors.port && <FormError message={errors.port.message} />}
                    </Form.Group>
                )}

                <Form.Group>
                    <Form.Label>
                        {t('task.autoTester.imageName')}
                        :
                    </Form.Label>
                    <Form.Control
                        type="text"
                        {...register('imageName', {
                            validate: {
                                imageSet: (v: string | undefined) => {
                                    const valid = (v && v !== '') || (watchFiles && watchFiles.length > 0);
                                    return valid ? true : t('task.autoTester.imageRequired')
                                        .toString();
                                },
                            },
                        })}
                        size="sm"
                        disabled={inProgress || (!!watchFiles && watchFiles.length > 0)}
                    />
                    {errors.imageName && <FormError message={errors.imageName.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('task.autoTester.uploadDockerfile')}
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
                            disabled={inProgress}
                            {...register('files', {
                                validate: fileSizeValidator.reactHookFormsValidator,
                            })}
                        />
                    </InputGroup>

                    {errors.files && <FormError message={errors.files.message} />}

                    <Form.Text muted>
                        {t('task.autoTester.uploadDockerfileHelp')}
                    </Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('task.autoTester.compileInstructions')}
                        :
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        {...register('compileInstructions', {
                            required: t('common.fieldRequired')
                                .toString(),
                        })}
                        size="sm"
                        disabled={inProgress}
                    />
                    {errors.compileInstructions && <FormError message={errors.compileInstructions.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('task.autoTester.runInstructions')}
                        :
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        {...register('runInstructions')}
                        size="sm"
                        disabled={inProgress}
                    />
                    <Form.Text muted>
                        {t(watchAppType === 'Web'
                            ? 'task.autoTester.runWebAppInstructionsHelp'
                            : 'task.autoTester.runInstructionsHelp')}
                    </Form.Text>
                    {errors.runInstructions && <FormError message={errors.runInstructions.message} />}
                </Form.Group>

                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        label={t('task.autoTester.showFullErrorMsg')}
                        {...register('showFullErrorMsg')}
                        disabled={inProgress}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        label={t('task.autoTester.reevaluateAutoTest')}
                        {...register('reevaluateAutoTest')}
                        disabled={inProgress}
                    />
                </Form.Group>

                {isActualSemester ? (
                    <ButtonGroup>
                        <FormButtons isLoading={saveInProgress} isDisabled={inProgress} />
                        <Button
                            disabled={inProgress || task.imageName !== watchImageName}
                            variant="info"
                            className="my-1 ml-1"
                            size="sm"
                            type="button"
                            onClick={onUpdateDockerImage}
                            title={task.imageName !== watchImageName ? t('task.autoTester.uploadPriorUpdate') : ''}
                        >
                            {updateInProgress && <Spinner animation="border" size="sm" />}
                            {' '}
                            {t('task.autoTester.updateImage')}
                        </Button>
                    </ButtonGroup>
                ) : null}
            </Form>
        </CustomCard>
    );
}
