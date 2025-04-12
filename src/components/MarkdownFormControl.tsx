import { Controller } from 'react-hook-form';
import { ReactNode } from 'react';

import { InsertFunc, ReactMdeWithCommands } from '@/components/ReactMdeWithCommands';

interface Props {
    name: string,
    control: any,
    rules: object,
    renderGallery?: (insertFunc: InsertFunc) => ReactNode
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
                <ReactMdeWithCommands
                    value={field.value}
                    onChange={field.onChange}
                    renderGallery={renderGallery}
                />
            )}
        />
    );
}
