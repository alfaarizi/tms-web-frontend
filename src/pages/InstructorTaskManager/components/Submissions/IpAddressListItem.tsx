import { Submission } from '@/resources/instructor/Submission';
import { IpAddress } from '@/resources/instructor/IpAddress';
import { useTranslation } from 'react-i18next';

type Props = {
    submission: Submission,
    ipAddress: IpAddress,
    isFirstAfterDeadline: boolean
}

export function IpAddressListItem({ submission, ipAddress, isFirstAfterDeadline }: Props) {
    const { t } = useTranslation();

    return (
        <tr>
            <td className={isFirstAfterDeadline ? 'border-danger' : ''}>
                {ipAddress.logTime}
            </td>
            <td className={isFirstAfterDeadline ? 'border-danger' : ''}>
                {ipAddress.translatedActivity}
                {submission.id !== ipAddress.submission?.id
                    && (
                        <>
                            <br />
                            <span className="font-italic">
                                {t('course.course')}
                                {': '}
                                {ipAddress.submission?.task?.group?.course.name}
                            </span>
                            <br />
                            <span className="font-italic">
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
            <td className={isFirstAfterDeadline ? 'border-danger' : ''}>
                {ipAddress.ipAddress}
            </td>
        </tr>
    );
}
