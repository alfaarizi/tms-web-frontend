type Props = {
    seconds: number
};

export function Time({ seconds }: Props) {
    const h = `${Math.floor(seconds / 3600)}`.padStart(2, '0');
    const m = `${Math.floor((seconds % 3600) / 60)}`.padStart(2, '0');
    const s = `${Math.floor((seconds % 3600) % 60)}`.padStart(2, '0');

    return <span>{`${h}:${m}:${s}`}</span>;
}
