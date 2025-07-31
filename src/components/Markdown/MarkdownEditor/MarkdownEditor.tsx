import MDEditor, { ICommand, RefMDEditor, commands } from '@uiw/react-md-editor';
import { MarkdownRenderer } from '@/components/Markdown/MarkdownRenderer/MarkdownRenderer';
import { ReactNode, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSquareFull, faSquareRootAlt, faSquareRootVariable, faImages,
} from '@fortawesome/free-solid-svg-icons';

import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { useShow } from '@/ui-hooks/useShow';

import '@/components/Markdown/MarkdownEditor/MarkdownEditor.css';

export type ImageGalleryInsertFunc = (imageUrl: string) => void;

type Props = {
    value: string,
    onChange: (newValue: string | undefined) => void,
    renderGallery?: (insertFunc: ImageGalleryInsertFunc) => ReactNode
}

const insertLatexFormulaCommand: ICommand = {
    name: 'insert-latex-formula',
    keyCommand: 'insert-latex-formula',
    groupName: 'latex',
    icon: (
        <FontAwesomeIcon icon={faSquareRootVariable} />
    ),
    execute: (state, textApi) => {
        textApi.replaceSelection(`$${state.selectedText}$`);
    },
};

const insertLatexBlockCommand: ICommand = {
    name: 'insert-latex-formula',
    keyCommand: 'insert-latex-formula',
    groupName: 'latex',
    icon: (
        <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon={faSquareFull} />
            <FontAwesomeIcon icon={faSquareRootAlt} transform="shrink-6" color="white" />
        </span>
    ),
    execute: (state, textApi) => {
        const newText = `
$$
${state.selectedText}
$$

`;
        textApi.replaceSelection(newText);
    },
};

const commandWithButtonProps = (command: ICommand, label: string) => ({
    ...command,
    buttonProps: {
        title: label,
        'aria-label': label,
    },
});

export function MarkdownEditor({
    value,
    onChange,
    renderGallery,
}: Props) {
    const { t, i18n } = useTranslation();
    const editorRef = useRef<RefMDEditor>(null);
    const { toggle, show } = useShow();

    const enabledCommands = useMemo(() => [
        commandWithButtonProps(commands.bold, t('markdownEditor.bold')),
        commandWithButtonProps(commands.italic, t('markdownEditor.italic')),
        commandWithButtonProps(commands.strikethrough, t('markdownEditor.strikethrough')),
        commandWithButtonProps(commands.hr, t('markdownEditor.hr')),
        commandWithButtonProps(commands.title, t('markdownEditor.title')),
        commands.divider,
        commandWithButtonProps(commands.link, t('markdownEditor.link')),
        commandWithButtonProps(commands.quote, t('markdownEditor.quote')),
        commandWithButtonProps(commands.code, t('markdownEditor.code')),
        commandWithButtonProps(commands.codeBlock, t('markdownEditor.codeBlock')),
        commandWithButtonProps(commands.image, t('markdownEditor.image')),
        commandWithButtonProps(commands.table, t('markdownEditor.table')),
        commandWithButtonProps(insertLatexFormulaCommand, t('markdownEditor.insertLatexFormula')),
        commandWithButtonProps(insertLatexBlockCommand, t('markdownEditor.insertLatexBlock')),
        commands.divider,
        commandWithButtonProps(commands.unorderedListCommand, t('markdownEditor.unorderedList')),
        commandWithButtonProps(commands.orderedListCommand, t('markdownEditor.orderedList')),
        commandWithButtonProps(commands.checkedListCommand, t('markdownEditor.checkedList')),
    ], [i18n.language]);

    const enabledExtraCommands = useMemo(() => [
        commandWithButtonProps(commands.codeEdit, t('markdownEditor.codeEdit')),
        commandWithButtonProps(commands.codeLive, t('markdownEditor.codeLive')),
        commandWithButtonProps(commands.codePreview, t('markdownEditor.codePreview')),
        commands.divider,
        commandWithButtonProps(commands.fullscreen, t('markdownEditor.fullscreen')),
    ], [i18n.language]);

    const handleImageGalleryInsert: ImageGalleryInsertFunc = (imageUrl: string) => {
        editorRef.current?.commandOrchestrator?.textApi.replaceSelection(`![image](${imageUrl})`);
    };

    return (
        <>
            <MDEditor
                value={value}
                onChange={onChange}
                ref={editorRef}
                preview="edit"
                commands={enabledCommands}
                extraCommands={enabledExtraCommands}
                components={{
                    // eslint-disable-next-line react/no-unstable-nested-components
                    preview: (source) => <MarkdownRenderer source={source} />,
                }}
            />
            {renderGallery
                ? (
                    <div className="my-1 py-1 border-bottom">
                        {/* Render show gallery button */}
                        <Button onClick={toggle} variant="outline-secondary" size="sm" className="mb-2">
                            <FontAwesomeIcon icon={faImages} />
                            {' '}
                            {show ? t('markdownEditor.closeImageManager') : t('markdownEditor.openImageManager')}
                        </Button>

                        {/* Render gallery and pass handleImageInsert function */}
                        {show && renderGallery(handleImageGalleryInsert)}
                    </div>
                ) : null}
        </>
    );
}
