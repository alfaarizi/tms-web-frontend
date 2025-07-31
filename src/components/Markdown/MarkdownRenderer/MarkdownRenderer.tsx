import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { createImageUrl } from '@/utils/createImageUrl';

import 'katex/dist/katex.min.css';
import styles from '@/components/Markdown/MarkdownRenderer/MarkdownRenderer.module.css';

type Props = {
    source: string,
    hasLengthLimit?: boolean
}

/**
 * Wrapper component for ReactMarkdown.
 * You can adjust global render settings here or you replace ReactMarkdown easily.
 * You should use this component to render markdown whenever possible.
 * @param source Markdown source code
 * @param hasLengthLimit Truncate the text if active
 * @constructor
 */
export function MarkdownRenderer({ source, hasLengthLimit }: Props) {
    const transformImgUrl = (url: string) => (url.startsWith('/examination') ? createImageUrl(url) : url);

    return (
        <div className={`${styles.markdownRenderer} ${hasLengthLimit ? styles.textTruncate : ''}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    // eslint-disable-next-line react/no-unstable-nested-components
                    img: (props) => (<img src={transformImgUrl(props.src || '')} alt={props.alt} />),
                }}
            >
                {source}
            </ReactMarkdown>
        </div>
    );
}
