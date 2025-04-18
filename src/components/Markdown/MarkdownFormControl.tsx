import { Controller } from 'react-hook-form';
import { ReactNode } from 'react';

import { MarkdownEditor, ImageGalleryInsertFunc } from '@/components/Markdown/MarkdownEditor/MarkdownEditor';

interface Props {
    name: string,
    control: any,
    rules: object,
    renderGallery?: (insertFunc: ImageGalleryInsertFunc) => ReactNode
}

/**
 * Wrap a ReactMde component with a react-hook-form Controller
 * @param props
 * @constructor
 */
export function MarkdownFormControl({
    name, control, rules, renderGallery,
}: Props) {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue=""
            rules={rules}
            render={({ field }) => (
                <MarkdownEditor value={field.value} onChange={field.onChange} renderGallery={renderGallery} />
            )}
        />
    );
}
