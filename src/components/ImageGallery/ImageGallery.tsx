import React, { ReactNode } from 'react';
import { Row } from 'react-bootstrap';

import { Image } from 'resources/common/Image';
import { ImageCard } from 'components/ImageGallery/ImageCard';
import styles from 'components/ImageGallery/ImageGallery.module.css';

type Props = {
    images: Image[] | undefined,
    renderButtons: (img: Image) => ReactNode
}

export function ImageGallery({
    images, renderButtons,
}: Props) {
    return (
        <div className={styles.imageGallery}>
            <Row>
                {
                    images?.map((img) => (
                        <ImageCard
                            key={img.name}
                            img={img}
                            renderButtons={renderButtons}
                        />
                    ))
                }
            </Row>
        </div>
    );
}
