import React from 'react';
import { ButtonGroup, Media } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faDownload } from '@fortawesome/free-solid-svg-icons';

import { ListCardItem } from 'components/ListCardItem/ListCardItem';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { DeleteButton } from 'components/Buttons/DeleteButton';

type Props = {
    name: string,
    onDownload: () => void,
    onRemove?: () => void
}

export function FileListItem({
    onRemove,
    onDownload,
    name,
}: Props) {
    return (
        <ListCardItem>
            <div className="d-flex justify-content-between text-muted">
                <Media>
                    <FontAwesomeIcon icon={faFile} size="lg" className="mr-2" />
                    <Media.Body>
                        <strong>{name}</strong>
                    </Media.Body>
                </Media>
                <ButtonGroup>
                    <ToolbarButton icon={faDownload} onClick={onDownload} />
                    {onRemove ? <DeleteButton showText={false} onDelete={onRemove} /> : null}
                </ButtonGroup>
            </div>
        </ListCardItem>
    );
}
