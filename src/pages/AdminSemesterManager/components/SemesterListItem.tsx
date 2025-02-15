import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { ListCardItem } from '@/components/ListCardItem/ListCardItem';
import { Semester } from '@/resources/common/Semester';

type Props = {
    semester: Semester
}

export function SemesterListItem({ semester }: Props) {
    const { t } = useTranslation();

    return (
        <ListCardItem className="d-flex justify-content-between">
            {semester.name}
            {semester.actual ? (
                <span>
                    <FontAwesomeIcon icon={faCheck} />
                    {' '}
                    {t('common.actual')}
                </span>
            ) : null}
        </ListCardItem>
    );
}
