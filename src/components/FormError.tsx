type Props = {
    message?: string
};

export function FormError({ message }: Props) {
    return <p className="text-danger">{message}</p>;
}
