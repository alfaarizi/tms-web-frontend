import { ReactNode } from 'react';
import { ButtonGroup, Card, Col } from 'react-bootstrap';

import { createImageUrl } from '@/utils/createImageUrl';
import { Image } from '@/resources/common/Image';

type Props = {
    img: Image,
    renderButtons?: (img: Image) => ReactNode
}

export function ImageCard({
    img,
    renderButtons,
}: Props) {
    let header = null;
    if (renderButtons) {
        header = (
            <Card.Header className="d-flex justify-content-end">
                <ButtonGroup>
                    {renderButtons(img)}
                </ButtonGroup>
            </Card.Header>
        );
    }

    return (
        <Col md={4} className="mb-4 d-flex align-items-stretch">
            <Card className="w-100 shadow-sm">
                {header}
                <Card.Img variant="bottom" src={createImageUrl(img.url)} className="h-75" />
            </Card>
        </Col>
    );
}
