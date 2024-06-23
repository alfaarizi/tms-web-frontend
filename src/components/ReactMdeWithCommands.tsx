import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import ReactMde, { Command, CommandContext, ExecuteOptions } from 'react-mde';
import { useTranslation } from 'react-i18next';
import {
    faImages, faTable, faSquareRootVariable, faSquareRootAlt, faSquareFull,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useShow } from 'ui-hooks/useShow';
import { MarkdownRenderer } from 'components/MarkdownRenderer/MarkdownRenderer';

// Import all react-mde styles expect react-mde-preview
// The MarkdownRenderer component will import the stylesheet for markdown content
import 'react-mde/lib/styles/css/react-mde-toolbar.css';
import 'react-mde/lib/styles/css/react-mde-editor.css';
import 'react-mde/lib/styles/css/react-mde.css';
import 'react-mde/lib/styles/css/react-mde-suggestions.css';

interface InsertImageCommandContext extends CommandContext {
    type: 'insert-image';
    url: string;
}

/**
 * Replaces selection with an image
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

/**
 * Wraps the current selection with a single line LaTeX block
 */
const insertLatexFormulaCommand: Command = {
    icon: () => (
        <FontAwesomeIcon icon={faSquareRootVariable} />
    ),
    execute: (options) => {
        options.textApi.replaceSelection(`$${options.initialState.selectedText}$`);
    },
};

/**
 * Wraps the current selection with a multiline LaTeX block
 */
const insertMultilineLatexFormulaCommand: Command = {
    icon: () => (
        <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon={faSquareFull} />
            <FontAwesomeIcon icon={faSquareRootAlt} transform="shrink-6" color="white" />
        </span>
    ),
    execute: (options: ExecuteOptions) => {
        const newText = `
$$
${options.initialState.selectedText}
$$

`;
        options.textApi.replaceSelection(newText);
    },
};

/**
 * Replaces selection with a table
 */
const insertTableCommand: Command = {
    icon: () => (
        <FontAwesomeIcon icon={faTable} />
    ),
    execute: (opts) => {
        const text = `
| header | header |
| ------ | ------ |
| cell | cell |
| cell | cell |

`;
        opts.textApi.replaceSelection(text);
    },
};

const toolbarButtons = [
    ['header', 'bold', 'italic', 'strikethrough'],
    ['link', 'quote', 'code', 'image', 'table'],
    ['unordered-list', 'ordered-list', 'checked-list'],
    ['insert-latex', 'insert-multiline-latex'],
];

export type InsertFunc = (url: string) => void;

type Props = {
    value: string;
    onChange: (value: string) => void;
    renderGallery?: (insertFunc: InsertFunc) => React.ReactNode;
}

/**
 * This component extends ReactMde with custom commands
 * Also, it includes a workaround for inserting images from an external gallery
 * @param props
 * @constructor
 */
export function ReactMdeWithCommands({ value, onChange, renderGallery }: Props) {
    const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');

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
                value={value}
                onChange={onChange}
                l18n={{
                    write: t('reactMde.write'),
                    preview: t('reactMde.preview'),
                    uploadingImage: t('reactMde.uploadingImage'),
                    pasteDropSelect: t('reactMde.pasteDropSelect'),
                }}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) => Promise.resolve(<MarkdownRenderer source={markdown} />)}
                childProps={{
                    writeButton: {
                        tabIndex: -1,
                    },
                }}
                commands={{
                    'insert-image': insertImageCommand,
                    'insert-latex': insertLatexFormulaCommand,
                    'insert-multiline-latex': insertMultilineLatexFormulaCommand,
                    table: insertTableCommand,
                }}
                toolbarCommands={toolbarButtons}
                ref={(c) => {
                    mdeRef.current = c;
                }}
            />

            {renderGallery
                ? (
                    <div className="my-1 py-1 border-bottom">
                        {/* Render show gallery button */}
                        <Button onClick={toggle} variant="outline-secondary" size="sm" className="mb-2">
                            <FontAwesomeIcon icon={faImages} />
                            {' '}
                            {show ? t('reactMde.closeImageManager') : t('reactMde.openImageManager')}
                        </Button>

                        {/* Render gallery and pass handleImageInsert function */}
                        {show && renderGallery(handleImageInsert)}
                    </div>
                ) : null}
        </>
    );
}
