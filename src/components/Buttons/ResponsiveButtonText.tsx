import React from 'react';

/**
 * Responsive breakpoints
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';

type Props = {
    text: string,
    displayTextBreakpoint: Breakpoint,
}

/**
 * Displays button text according to the current viewport size
 * @param text Text string
 * @param displayTextBreakpoint The first viewport size where the button text is visible
 * @constructor
 */
export function ResponsiveButtonText({ text, displayTextBreakpoint }: Props) {
    let className: string | undefined;
    if (displayTextBreakpoint === 'none') {
        className = 'd-none';
    } else if (displayTextBreakpoint !== 'xs') {
        className = `d-none d-${displayTextBreakpoint}-inline`;
    }

    return (
        <span className={className}>
            {' '}
            {text}
        </span>
    );
}
