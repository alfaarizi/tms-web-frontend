import React from 'react';

type Props = {
    seconds: number
};

export function Time({ seconds }: Props) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor((seconds % 3600) % 60);

    return <span>{`${h}:${m}:${s}`}</span>;
}
