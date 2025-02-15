import { ToolbarDropdown } from '@/components/Buttons/ToolbarDropdown';
import {
    faEye, faGlobe, faPlay, faStop, faDownload,
} from '@fortawesome/free-solid-svg-icons';
import DropdownItem from 'react-bootstrap/DropdownItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useTranslation } from 'react-i18next';
import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { SetupWebAppExecution } from '@/resources/instructor/SetupWebAppExecution';
import { useForm } from 'react-hook-form';
import {
    Button, Form, OverlayTrigger, Popover, Spinner,
} from 'react-bootstrap';
import { FormError } from '@/components/FormError';
import { LocaleDateTime } from '@/components/LocaleDateTime';
import {
    useDownloadRunLog,
    useStartWebAppExecutionMutation,
    useStopWebAppExecutionMutation,
    useWebAppExecution,
} from '@/hooks/instructor/WebAppExecutionHook';
import { usePrivateSystemInfoQuery } from '@/hooks/common/SystemHooks';
import { useNotifications } from '@/hooks/common/useNotifications';
import { ServerSideValidationError } from '@/exceptions/ServerSideValidationError';
import { getFirstError } from '@/utils/getFirstError';
import { WebAppExecution } from '@/resources/instructor/WebAppExecution';
import { Submission } from '@/resources/instructor/Submission';

type Props = {
    file: Submission,
}

export function WebAppExecutionControl({
    file,
}: Props) {
    const webAppExecution = useWebAppExecution(file);
    const privateSystemInfo = usePrivateSystemInfoQuery(false);
    const onStartUp = useStartWebAppExecutionMutation(file);
    const onTearDown = useStopWebAppExecutionMutation(file);
    const downloadRunLogMutation = useDownloadRunLog();
    const isLoading = onStartUp.isLoading || onTearDown.isLoading;
    const { t } = useTranslation();
    const notification = useNotifications();
    const {
        handleSubmit,
        register,
        formState: {
            errors,
        },
    } = useForm<SetupWebAppExecution>();

    const handleStart = async (data: SetupWebAppExecution) => {
        try {
            const exec = await onStartUp.mutateAsync(data);
            notification.push({
                variant: 'success',
                message: t('task.exec.onStartUp', { url: exec.url }),
            });
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                const err = getFirstError(e.body);
                notification.push({
                    variant: 'error',
                    message: err || '',
                });
            }
        }
    };

    const handleStop = async () => {
        try {
            if (webAppExecution.data) {
                await onTearDown.mutateAsync(webAppExecution.data);
                notification.push({
                    variant: 'success',
                    message: t('task.exec.onTearDown'),
                });
            }
        } catch (e) {
            // handled already
        }
    };

    const handleDownload = (webAppExec: WebAppExecution) => {
        downloadRunLogMutation.download('run.log', webAppExec);
    };

    const onSubmit = handleSubmit((data: SetupWebAppExecution) => {
        handleStart(data);
    });

    const startFormPopover = (
        <Popover id="popover-start-form">
            <Popover.Content>
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Label>{t('task.exec.form.runInterval')}</Form.Label>
                        <Form.Control
                            type="number"
                            disabled={isLoading}
                            size="sm"
                            {...register('runInterval', {
                                required: t('common.fieldRequired'),
                                valueAsNumber: true,
                                value: privateSystemInfo.data!.maxWebAppRunTime,
                                min: {
                                    value: 10,
                                    message: `${t('common.minValueRequired', { value: 10 })}`,
                                },
                                max: {
                                    value: privateSystemInfo.data!.maxWebAppRunTime,
                                    message: `${t(
                                        'common.maxValueRequired',
                                        { value: privateSystemInfo.data!.maxWebAppRunTime },
                                    )}`,
                                },
                            })}
                        />
                        {errors.runInterval && (
                            <FormError message={errors.runInterval.message} />
                        )}
                    </Form.Group>
                    <Button variant="light" type="submit" size="sm" disabled={isLoading}>
                        {isLoading ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faPlay} />}
                        {' '}
                        {t('task.exec.startUp')}
                    </Button>
                </Form>
            </Popover.Content>
        </Popover>
    );

    return (
        webAppExecution.data
            ? (
                <ToolbarDropdown text={t('task.exec.webApp')} icon={faGlobe} disabled={isLoading}>
                    <DropdownItem disabled>
                        {t('task.exec.autoTearDownAt')}
                        {': '}
                        <LocaleDateTime value={webAppExecution.data.shutdownAt} />
                    </DropdownItem>
                    <DropdownItem
                        disabled={isLoading}
                        onSelect={() => window.open(webAppExecution.data.url, '_blank', 'noopener,noreferrer')}
                    >
                        <FontAwesomeIcon icon={faEye} />
                        {' '}
                        {t('task.exec.visit', { url: webAppExecution.data.url })}
                    </DropdownItem>
                    <DropdownItem
                        disabled={isLoading}
                        onSelect={() => handleStop()}
                    >
                        <FontAwesomeIcon icon={faStop} />
                        {' '}
                        {t('task.exec.tearDown')}
                    </DropdownItem>
                    <DropdownItem
                        disabled={isLoading}
                        onSelect={() => handleDownload(webAppExecution.data)}
                    >
                        <FontAwesomeIcon icon={faDownload} />
                        {' '}
                        {t('task.exec.downloadRunLog')}
                    </DropdownItem>
                </ToolbarDropdown>
            )
            : (
                <OverlayTrigger
                    trigger="click"
                    rootClose
                    placement="bottom"
                    overlay={startFormPopover}
                    defaultShow={false}
                >
                    <ToolbarButton
                        icon={faPlay}
                        text={t('task.exec.startUp')}
                        displayTextBreakpoint="none"
                        isLoading={isLoading}
                    />
                </OverlayTrigger>
            )
    );
}
