import React, { ReactNode } from 'react';

import { CustomCard } from 'components/CustomCard/CustomCard';
import { MarkdownRenderer } from 'components/MarkdownRenderer/MarkdownRenderer';

type Props = {
    text: string,
    options?: ReactNode,
    children: ReactNode
}

export function QuizQuestionCard({
    text,
    children,
    options,
}: Props) {
    return (
        <CustomCard>
            <MarkdownRenderer source={text} />
            <div className="border-top py-1">
                <div className="w-100 d-flex justify-content-end py-2">
                    {options}
                </div>
                {children}
            </div>
        </CustomCard>
    );
}
