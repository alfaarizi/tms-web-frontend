import { Modal, Table } from 'react-bootstrap';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Submission } from 'resources/instructor/Submission';
import { useIpAddresses } from 'hooks/instructor/SubmissionHooks';
import { IpAddressListItem } from 'pages/InstructorTaskManager/components/Submissions/IpAddressListItem';

type Props = {
    submission: Submission|null;
    show: boolean,
    onClose: () => void,
}

export function IpLogModal({
    submission,
    show,
    onClose,
}: Props) {
    const { t } = useTranslation();
    const ipAddresses = useIpAddresses(submission?.id!, show && submission !== null);

    const handleHide = () => {
        onClose();
    };

    // Render
    return (
        <>
            <Modal
                show={show}
                animation
                size="lg"
                onHide={handleHide}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t('task.ipLog.title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th className="border-top-0">{t('task.ipLog.date')}</th>
                                <th className="border-top-0">{t('task.ipLog.activity')}</th>
                                <th className="border-top-0">{t('task.ipLog.address')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submission && ipAddresses.data?.map((ipAddress) => (
                                <IpAddressListItem
                                    key={ipAddress.id}
                                    submission={submission}
                                    ipAddress={ipAddress}
                                />
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </>
    );
}
