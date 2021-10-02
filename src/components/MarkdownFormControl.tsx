import { Controller } from 'react-hook-form';
import React, { ReactNode, useState } from 'react';
import 'react-mde/lib/styles/css/react-mde-all.css';

import { InsertFunc, ReactMdeWithCommands } from 'components/ReactMdeWithCommands';
import { MarkdownRenderer } from 'components/MarkdownRenderer/MarkdownRenderer';

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
    const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');

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
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                    generateMarkdownPreview={(markdown) => Promise.resolve(<MarkdownRenderer source={markdown} />)}
                    childProps={{
                        writeButton: {
                            tabIndex: -1,
                        },
                    }}
                />
            )}
        />
    );
}
