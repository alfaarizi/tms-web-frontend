import React from 'react';

import { Submission } from 'resources/instructor/Submission';
import { IpAddress } from 'resources/instructor/IpAddress';
import { useTranslation } from 'react-i18next';

type Props = {
    submission: Submission,
    ipAddress: IpAddress
}

export function IpAddressListItem({ submission, ipAddress }: Props) {
    const { t } = useTranslation();

    return (
        <tr>
            <td>
                {ipAddress.logTime}
            </td>
            <td>
                {ipAddress.translatedActivity}
                {submission.id !== ipAddress.submission?.id
                    && (
                        <>
                            <br />
                            <span>
                                {t('course.course')}
                                {': '}
                                {ipAddress.submission?.task?.group?.course.name}
                            </span>
                            <br />
                            <span>
                                {t('task.task')}
                                {': '}
                                {ipAddress.submission?.task?.name}
                            </span>
                        </>
                    )}
                {submission.id === ipAddress.submission?.id && ipAddress.activity === 'Submission upload'
                    && (
                        <>
                            <br />
                            <span className="font-italic">
                                (
                                {t('task.ipLog.sameTaskUpload')}
                                )
                            </span>
                        </>
                    )}
                {submission.id === ipAddress.submission?.id && ipAddress.activity === 'Submission download'
                    && (
                        <>
                            <br />
                            <span className="font-italic">
                                (
                                {t('task.ipLog.sameTaskDownload')}
                                )
                            </span>
                        </>
                    )}
            </td>
            <td>
                {ipAddress.ipAddress}
            </td>
        </tr>
    );
}
