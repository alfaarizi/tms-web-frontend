import { useEffect } from 'react';
import { ButtonGroup, Form } from 'react-bootstrap';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';

import { SetupCodeChecker } from '@/resources/instructor/SetupCodeChecker';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { FormError } from '@/components/FormError';
import { FormButtons } from '@/components/Buttons/FormButtons';
import { Task } from '@/resources/instructor/Task';
import { StaticAnalyzerTool } from '@/resources/instructor/StaticAnalyzerTool';

type Props = {
    task: Task,
    onSave: (data: SetupCodeChecker) => void,
    inProgress: boolean,
    supportedStaticAnalyzers: StaticAnalyzerTool[],
    isActualSemester: boolean,
}

export function CodeCheckerSettingsForm({
    task, onSave, inProgress, supportedStaticAnalyzers, isActualSemester,
}: Props) {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        setValue,
        watch,

        formState: {
            errors,
        },
    } = useForm<SetupCodeChecker>();

    // Set data from task resource
    useEffect(() => {
        setValue('staticCodeAnalysis', task.staticCodeAnalysis);
        setValue('staticCodeAnalyzerTool', task.staticCodeAnalyzerTool || 'codechecker');
        setValue('staticCodeAnalyzerInstructions', task.staticCodeAnalyzerInstructions);
        setValue('codeCheckerCompileInstructions', task.codeCheckerCompileInstructions);
        setValue('codeCheckerCompileInstructions', task.codeCheckerCompileInstructions);
        setValue('codeCheckerToggles', task.codeCheckerToggles);
        setValue('codeCheckerSkipFile', task.codeCheckerSkipFile);
    }, [
        task.staticCodeAnalysis,
        task.staticCodeAnalyzerTool,
        task.staticCodeAnalyzerInstructions,
        task.codeCheckerCompileInstructions,
        task.codeCheckerToggles,
        task.codeCheckerSkipFile,
    ]);

    const onSubmit = handleSubmit((data: SetupCodeChecker) => {
        onSave(data);
    });

    const enabled = !!watch('staticCodeAnalysis');
    const selectedTool = watch('staticCodeAnalyzerTool');
    const toolIsCodeChecker = selectedTool === 'codechecker';
    const selectedToolOutputPath = !toolIsCodeChecker
        ? supportedStaticAnalyzers.find((tool) => tool.name === selectedTool)?.outputPath
        : null;

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
                        id="activateStaticAnalysis"
                        label={t('task.evaluator.activateStaticCodeAnalysis')}
                        {...register('staticCodeAnalysis')}
                        disabled={inProgress}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>
                        {t('task.evaluator.staticCodeAnalyzerTool')}
                        :
                    </Form.Label>
                    <Form.Control
                        as="select"
                        size="sm"
                        {...register('staticCodeAnalyzerTool')}
                    >
                        <option value="codechecker">CodeChecker (C/C++)</option>
                        {supportedStaticAnalyzers
                            .map((tool) => <option key={tool.name} value={tool.name}>{tool.title}</option>)}
                    </Form.Control>
                </Form.Group>

                <div className={toolIsCodeChecker ? 'd-block' : 'd-none'}>
                    <Form.Group>
                        <Form.Label>
                            {t('task.evaluator.compileInstructions')}
                            :
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            {...register('codeCheckerCompileInstructions', {
                                required: enabled && toolIsCodeChecker
                                    ? t('common.fieldRequired').toString()
                                    : undefined,
                            })}
                            size="sm"
                            disabled={inProgress}
                            rows={7}
                        />
                        {errors.codeCheckerCompileInstructions
                            && <FormError message={errors.codeCheckerCompileInstructions.message} />}
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            {t('task.evaluator.codeCheckerToggles')}
                            :
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            {...register('codeCheckerToggles')}
                            size="sm"
                            disabled={inProgress}
                            rows={3}
                        />
                        {errors.codeCheckerToggles
                            && <FormError message={errors.codeCheckerToggles.message} />}
                        <Form.Text muted>
                            <a
                                href="https://codechecker.readthedocs.io/en/latest/analyzer/user_guide/#check"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FontAwesomeIcon icon={faExternalLink} />
                                {' '}
                                {t('task.evaluator.codeCheckerTogglesHelp')}
                            </a>
                        </Form.Text>
                    </Form.Group>

                </div>

                <div className={!toolIsCodeChecker ? 'd-block' : 'd-none'}>
                    <Form.Group>
                        <Form.Label>
                            {t('task.evaluator.staticCodeAnalyzerInstructions')}
                            :
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            {...register('staticCodeAnalyzerInstructions', {
                                required: enabled && !toolIsCodeChecker
                                    ? t('common.fieldRequired').toString()
                                    : undefined,
                            })}
                            size="sm"
                            disabled={inProgress}
                            rows={7}
                        />
                        {errors.staticCodeAnalyzerInstructions
                            && <FormError message={errors.staticCodeAnalyzerInstructions.message} />}
                        <Form.Text muted>
                            {t(
                                'task.evaluator.staticCodeAnalyzerInstructionsHelp',
                                {
                                    outputPathLinux: selectedToolOutputPath,
                                    outputPathWindows: selectedToolOutputPath?.replace(/\//g, '\\'),
                                },
                            )}
                        </Form.Text>
                    </Form.Group>
                </div>

                <Form.Group>
                    <Form.Label>
                        {t('task.evaluator.codeCheckerSkipFile')}
                        :
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        {...register('codeCheckerSkipFile')}
                        size="sm"
                        disabled={inProgress}
                        rows={5}
                    />
                    {errors.codeCheckerSkipFile
                        && <FormError message={errors.codeCheckerSkipFile.message} />}
                    <Form.Text muted>
                        <a
                            href="https://codechecker.readthedocs.io/en/latest/analyzer/user_guide/#skip"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FontAwesomeIcon icon={faExternalLink} />
                            {' '}
                            {t('task.evaluator.codeCheckerSkipFileHelp')}
                        </a>
                    </Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        id="reevaluateStaticCodeAnalysis"
                        label={t('task.evaluator.reevaluate')}
                        {...register('reevaluateStaticCodeAnalysis')}
                        disabled={inProgress}
                    />
                </Form.Group>

                {isActualSemester && (
                    <ButtonGroup>
                        <FormButtons isLoading={inProgress} isDisabled={inProgress} />
                    </ButtonGroup>
                )}
            </Form>
        </CustomCard>
    );
}
