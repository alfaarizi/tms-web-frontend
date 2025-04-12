import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { createImageUrl } from '@/utils/createImageUrl';

import 'katex/dist/katex.min.css';
import styles from '@/components/MarkdownRenderer/MarkdownRenderer.module.css';

type Props = {
    source: string,
    hasLengthLimit?: boolean
}

/**
 * Wrapper component for ReactMarkdown.
 * You can adjust global render settings here or you replace ReactMarkdown easily.
 * You should use this component to render markdown whenever possible.
 * @param source
 * @constructor
 */
export function MarkdownRenderer({ source, hasLengthLimit }: Props) {
    const transformImgUrl = (url: string) => (url.startsWith('/examination') ? createImageUrl(url) : url);

    return (
        <ReactMarkdown
            className={`${styles.markdownRenderer} ${hasLengthLimit ? styles.textTruncate : ''}`}
            transformImageUri={transformImgUrl}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
        >
            {source}
        </ReactMarkdown>
    );
}
