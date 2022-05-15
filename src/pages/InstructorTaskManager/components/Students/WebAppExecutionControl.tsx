import { ToolbarDropdown } from 'components/Buttons/ToolbarDropdown';
import {
    faEye, faGlobe, faPlay, faSave, faStop,
} from '@fortawesome/free-solid-svg-icons';
import DropdownItem from 'react-bootstrap/DropdownItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { SetupWebAppExecution } from 'resources/instructor/SetupWebAppExecution';
import { useForm } from 'react-hook-form';
import {
    Button, Form, OverlayTrigger, Popover, Spinner,
} from 'react-bootstrap';
import { FormError } from 'components/FormError';
import { LocaleDateTime } from 'components/LocaleDateTime';
import {
    useStartWebAppExecutionMutation,
    useStopWebAppExecutionMutation,
    useWebAppExecution,
} from 'hooks/instructor/WebAppExecutionHook';
import { StudentFile } from 'resources/instructor/StudentFile';
import { useNotifications } from 'hooks/common/useNotifications';
import { ServerSideValidationError } from 'exceptions/ServerSideValidationError';
import { getFirstError } from 'utils/getFirstError';

type Props = {
    file: StudentFile,
}

export function WebAppExecutionControl({
    file,
}: Props) {
    const webAppExecution = useWebAppExecution(file);
    const onStartUp = useStartWebAppExecutionMutation(file);
    const onTearDown = useStopWebAppExecutionMutation(file);
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
                                required: t('common.fieldRequired').toString(),
                                valueAsNumber: true,
                                value: 30,
                                min: {
                                    value: 10,
                                    message: t('common.minValueRequired', { value: 10 }).toString(),
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
        <>
            {webAppExecution.data
                ? (
                    <>
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
                        </ToolbarDropdown>
                    </>
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
                )}
        </>
    );
}
