import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import {
    ButtonGroup, Form, Alert, InputGroup,
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

type Props = {
    onSave: (task: SetupTester) => void,
    task: Task,
    formData: TesterFormData,
    inProgress: boolean,
    isActualSemester: boolean
}

export function AutoTesterForm({
    task,
    onSave,
    formData,
    inProgress,
    isActualSemester,
}: Props) {
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
            setValue('imageName', task.imageName);
            setValue('compileInstructions', task.compileInstructions);
            setValue('runInstructions', task.runInstructions || '');
            setValue('showFullErrorMsg', task.showFullErrorMsg === 1);
            handleResetFileUpload();
        }
    }, [task.imageName]);

    const onSubmit = handleSubmit((data: SetupTester) => {
        onSave(data);
    });

    const handleSetTemplate = (template: TesterTemplate) => {
        setValue('testOS', template.os);
        setValue('imageName', template.image);
        setValue('compileInstructions', template.compileInstructions);
        setValue('runInstructions', template.runInstructions);

        handleResetFileUpload();
    };

    // Render
    const osOptions = Object.keys(formData.osMap)
        .map((key: string) => <option key={key} value={key}>{formData.osMap[key]}</option>);

    let alertToShow;
    if (inProgress) {
        alertToShow = <Alert variant="dark">{t('task.autoTester.inProgress')}</Alert>;
    } else if (formData.imageSuccessfullyBuilt) {
        alertToShow = <Alert variant="success">{t('task.autoTester.successfullyBuild')}</Alert>;
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
                        {t('task.autoTester.runInstructionsHelp')}
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

                {isActualSemester ? <FormButtons isLoading={inProgress} /> : null}
            </Form>
        </CustomCard>
    );
}
