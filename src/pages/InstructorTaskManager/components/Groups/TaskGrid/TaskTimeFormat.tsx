type Props = {
    date: Date,
};

export function TaskTimeFormat({ date }: Props) {
    const [hour, minute] = date.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: false,
    }).split(':');
    return (
        <>
            {hour}
            <sup>{minute}</sup>
        </>
    );
}
