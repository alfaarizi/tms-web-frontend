import React, { ReactNode } from 'react';
import { ButtonGroup, Media } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { ListCardItem } from 'components/ListCardItem/ListCardItem';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { DeleteToolbarButton } from 'components/Buttons/DeleteToolbarButton';

type Props = {
    name: string,
    children?: ReactNode,
    onDownload: () => void,
    onRemove?: () => void
}

export function FileListItem({
    name,
    children,
    onRemove,
    onDownload,
}: Props) {
    const { t } = useTranslation();

    return (
        <ListCardItem>
            <div className="d-flex justify-content-between text-muted">
                <Media>
                    <FontAwesomeIcon icon={faFile} size="lg" className="mr-2" />
                    <Media.Body>
                        <strong>{name}</strong>
                        {children ? (<div>{children}</div>) : null}
                    </Media.Body>
                </Media>
                <ButtonGroup>
                    <ToolbarButton
                        text={t('common.download')}
                        displayTextBreakpoint="none"
                        icon={faDownload}
                        onClick={onDownload}
                    />
                    {onRemove
                        ? <DeleteToolbarButton displayTextBreakpoint="none" onDelete={onRemove} itemName={name} />
                        : null}
                </ButtonGroup>
            </div>
        </ListCardItem>
    );
}
