import { Jumbotron } from 'react-bootstrap';
import { SingleColumnLayout } from '@/layouts/SingleColumnLayout';

type Props = {
    title: string;
    message?: string;
}

/**
 * Reusable error page
 * @param title Page title, short description about the error
 * @param message Detailed error message (optional)
 * @constructor
 */
export function ErrorPage({ title, message }: Props) {
    return (
        <SingleColumnLayout>
            <Jumbotron className="mt-4">
                <h1>{title}</h1>
                {message ? <p>{message}</p> : null}
            </Jumbotron>
        </SingleColumnLayout>
    );
}
