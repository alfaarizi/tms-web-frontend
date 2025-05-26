import React, { useEffect, useMemo, useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faExclamation } from '@fortawesome/free-solid-svg-icons';

import { SingleColumnLayout } from '@/layouts/SingleColumnLayout';
import { FormButtons } from '@/components/Buttons/FormButtons';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { FormError } from '@/components/FormError';
import { ServerSideValidationError, ValidationErrorBody } from '@/exceptions/ServerSideValidationError';
import { useNotifications } from '@/hooks/common/useNotifications';
import { useUserSettings, useSettingsMutation } from '@/hooks/common/UserHooks';
import { NotificationTarget, UserSettings } from '@/resources/common/UserSettings';
import { useServersideFormErrors } from '@/ui-hooks/useServersideFormErrors';
import { useTextPaste } from '@/ui-hooks/useTextPaste';
import { TranslationTopContent } from '@/i18n/i18n';
import { useBranding } from '@/ui-hooks/useBranding';

export function SettingsPage() {
    const userSettings = useUserSettings();
    const settingsMutation = useSettingsMutation();
    const settingsData = userSettings.data;
    const { t, i18n } = useTranslation();
    const notifications = useNotifications();
    const [customEmail, setCustomEmail] = useState<string | null>(null);
    const [serverSideError, setServerSideError] = useState<ValidationErrorBody | null>(null);
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,

        formState: {
            errors,
        },
    } = useForm<UserSettings>({
        mode: 'onBlur',
    });

    useServersideFormErrors<UserSettings>(clearErrors, setError, serverSideError);
    const handleCustomEmailKeypress = useMemo(
        () => (e: React.KeyboardEvent<HTMLInputElement>) => setCustomEmail(e.currentTarget.value),
        // eslint-disable-next-line comma-dangle
        [setCustomEmail]
    );
    useEffect(() => {
        if (settingsData) {
            setValue('name', settingsData.name);
            setValue('userCode', settingsData.userCode);
            setValue('email', settingsData.email);
            setValue('customEmail', settingsData.customEmail);
            setCustomEmail(settingsData.customEmail);
            setValue('notificationTarget', settingsData.notificationTarget);
            setValue('locale', settingsData.locale);
        }
    }, [settingsData]);

    const branding = useBranding();

    const handleTextPaste = useTextPaste(setValue);

    if (!settingsData) {
        return null;
    }

    const onSubmit = handleSubmit(async (data) => {
        try {
            await settingsMutation.mutateAsync(data);
            notifications.push({
                variant: 'success',
                message: t('settings.successfullySaved'),
            });
        } catch (e) {
            if (e instanceof ServerSideValidationError) {
                setServerSideError(e.body);
            }
        }
    });

    function getCustomEmailConfirmedIndicator(userData: UserSettings, currentEmail: string | null) {
        if (!currentEmail) {
            return null;
        }
        let icon: IconProp;
        let text: string;
        if (userData.customEmailConfirmed && currentEmail === userData.customEmail) {
            icon = faCheck;
            text = t('settings.customEmail.confirmed');
        } else {
            icon = faExclamation;
            text = t('settings.customEmail.unconfirmed');
        }
        return (
            <InputGroup.Append>
                <InputGroup.Text title={text} aria-label={text}>
                    <FontAwesomeIcon fixedWidth icon={icon} />
                </InputGroup.Text>
            </InputGroup.Append>
        );
    }

    function getNotifTargets(userData: UserSettings, currentEmail: string | null) {
        const targets: Record<NotificationTarget, string|null> = {
            official: null,
            custom: null,
            none: null,
        };
        if (!currentEmail || currentEmail !== userData.customEmail || !userData.customEmailConfirmed) {
            targets.custom = t('settings.notificationTarget.noEmailToUnconfirmedAddress');
        }
        return targets;
    }

    const languages = i18n.services.resourceStore.data;
    return (
        <SingleColumnLayout>
            <CustomCard>
                <CustomCardHeader>
                    <CustomCardTitle>
                        {t('common.settings')}
                    </CustomCardTitle>
                </CustomCardHeader>
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Label>
                            {t('common.name')}
                            :
                        </Form.Label>
                        <Form.Control
                            type="text"
                            disabled
                            {...register('name', {
                                required: false,
                            })}
                            onPaste={handleTextPaste}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            {t('common.userCode', { uniId: branding.universityIdentifierName[i18n.language] })}
                            :
                        </Form.Label>
                        <Form.Control
                            type="text"
                            disabled
                            {...register('userCode', {
                                required: false,
                            })}
                            onPaste={handleTextPaste}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            {t('common.officialEmail')}
                            :
                        </Form.Label>
                        <Form.Control
                            type="email"
                            disabled
                            {...register('email', {
                                required: false,
                            })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            {t('common.customEmail')}
                            :
                        </Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="email"
                                onKeyUp={handleCustomEmailKeypress}
                                {...register('customEmail', {
                                    required: false,
                                    deps: ['notificationTarget'],
                                })}
                            />
                            {getCustomEmailConfirmedIndicator(settingsData, customEmail)}
                        </InputGroup>
                        {errors.customEmail && <FormError message={errors.customEmail.message} />}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            {t('settings.notificationTarget.label')}
                        </Form.Label>
                        <Form.Control
                            as="select"
                            {...register('notificationTarget', {
                                required: t('settings.notificationTarget.required') as string,
                                validate: (val) => getNotifTargets(settingsData, customEmail)[val] || true,
                            })}
                        >
                            {
                                Object.entries(getNotifTargets(settingsData, customEmail)).map(([key, reason]) => (
                                    <option
                                        key={key}
                                        value={key}
                                        disabled={!!reason}
                                        title={reason || undefined}
                                    >
                                        {
                                            // Keys used here, for grep:
                                            // - settings.notificationTarget.official
                                            // - settings.notificationTarget.custom
                                            // - settings.notificationTarget.none
                                            t(`settings.notificationTarget.${key}`)
                                        }
                                    </option>
                                ))
                            }
                        </Form.Control>
                        {errors.notificationTarget && <FormError message={errors.notificationTarget.message} />}
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            {t('settings.language.label')}
                            :
                        </Form.Label>
                        <Form.Control
                            as="select"
                            {...register('locale', {
                                required: t('settings.language.required') as string,
                            })}
                        >
                            {
                                Object.keys(languages).map((key) => (
                                    <option key={key} value={key} lang={key}>
                                        {(languages[key]?.translation as TranslationTopContent).autonym}
                                    </option>
                                ))
                            }
                        </Form.Control>
                        {errors.locale && <FormError message={errors.locale.message} />}
                    </Form.Group>
                    <FormButtons isLoading={settingsMutation.isLoading} />
                </Form>
            </CustomCard>
        </SingleColumnLayout>
    );
}
