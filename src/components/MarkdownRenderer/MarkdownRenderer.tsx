import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createImageUrl } from 'utils/createImageUrl';

import styles from 'components/MarkdownRenderer/MarkdownRenderer.module.css';

type Props = {
    source: string
}

/**
 * Wrapper component for ReactMarkdown.
 * You can adjust global render settings here or you replace ReactMarkdown easily.
 * You should use this component to render markdown whenever possible.
 * @param source
 * @constructor
 */
export function MarkdownRenderer({ source }: Props) {
    const transformImgUrl = (url: string) => (url.startsWith('/examination') ? createImageUrl(url) : url);

    return (
        <ReactMarkdown
            className={styles.markdownRenderer}
            transformImageUri={transformImgUrl}
            remarkPlugins={[remarkGfm]}
        >
            {source}
        </ReactMarkdown>
    );
}
