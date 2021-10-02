/* eslint react/destructuring-assignment: 0 */
import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import ReactMde, { Command, CommandContext, ExecuteOptions } from 'react-mde';
import { ReactMdeProps } from 'react-mde/lib/definitions/components/ReactMde';
import { useTranslation } from 'react-i18next';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import 'react-mde/lib/styles/css/react-mde-all.css';

import { useShow } from 'ui-hooks/useShow';

interface InsertImageCommandContext extends CommandContext {
    type: 'insert-image';
    url: string;
}

/**
 * Replaces selection with image
 */
const insertImageCommand: Command = {
    execute: (options: ExecuteOptions) => {
        // Get image url from context
        const ctx = options.context as InsertImageCommandContext;
        const imageTemplate = ctx.url;
        // Replace selection
        options.textApi.replaceSelection(`![image](${imageTemplate})`);
    },
};

export type InsertFunc = (url: string) => void;

interface Props extends ReactMdeProps {
    renderGallery?: (insertFunc: InsertFunc) => React.ReactNode
}

/**
 * This is a workaround for inserting images from an external gallery
 * @param props
 * @constructor
 */
export function ReactMdeWithCommands(props: Props) {
    // We will access ReactMde editor with a ref
    const mdeRef = useRef<any>(null);
    const {
        show,
        toggle,
    } = useShow();
    const { t } = useTranslation();

    // Call image insert command externally
    const handleImageInsert = (url: string) => {
        if (mdeRef.current && mdeRef.current?.commandOrchestrator) {
            mdeRef.current?.commandOrchestrator.executeCommand(
                'insert-image',
                {
                    type: 'insert-image',
                    url,
                },
            );
        }
    };

    return (
        <>
            {/* Pass original props to ReactMde, and add insert-image command */}
            <ReactMde
                {...props}
                l18n={{
                    write: t('reactMde.write'),
                    preview: t('reactMde.preview'),
                    uploadingImage: t('reactMde.uploadingImage'),
                    pasteDropSelect: t('reactMde.pasteDropSelect'),
                }}
                commands={{
                    ...props.commands,
                    'insert-image': insertImageCommand,
                }}
                ref={(c) => {
                    mdeRef.current = c;
                }}
            />

            {props.renderGallery
                ? (
                    <div className="my-1 py-1 border-bottom">
                        {/* Render show gallery button */}
                        <Button onClick={toggle} variant="outline-secondary" size="sm" className="mb-2">
                            <FontAwesomeIcon icon={faImages} />
                            {' '}
                            {show ? t('reactMde.closeImageManager') : t('reactMde.openImageManager')}
                        </Button>

                        {/* Render gallery and pass handleImageInsert function */}
                        {show && props.renderGallery(handleImageInsert)}
                    </div>
                ) : null}
        </>
    );
}
