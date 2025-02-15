import { Badge } from 'react-bootstrap';

import { PageHeader } from '@/components/Navigation/PageHeader';
import { Time } from '@/components/Time';

type Props = {
    testName: string,
    duration: number
}

export function TestWriterHeader({
    duration,
    testName,
}: Props) {
    return (
        <PageHeader>
            <h1>
                {testName}
            </h1>
            <h1>
                <Badge variant="secondary"><Time seconds={duration} /></Badge>
            </h1>
        </PageHeader>
    );
}
