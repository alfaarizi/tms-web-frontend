import { useTranslation } from 'react-i18next';
import { DataRow } from '@/components/DataRow';
import { ButtonGroup } from 'react-bootstrap';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import { Plagiarism } from '@/resources/instructor/Plagiarism';
import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { DeleteToolbarButton } from '@/components/Buttons/DeleteToolbarButton';
import { MultiLineTextBlock } from '@/components/MutliLineTextBlock/MultiLineTextBlock';

type Props = {
    report: Plagiarism,
    onEdit: () => void
    onDelete: () => void,
    isActualSemester: boolean
}

export function RequestDetails({
    onDelete,
    onEdit,
    report,
    isActualSemester,
}: Props) {
    const { t } = useTranslation();

    const typeData = report.typeSpecificData;
    let typeDataUI;
    switch (typeData.type) {
    case 'moss':
        typeDataUI = <DataRow label={t('plagiarism.moss.ignoreThreshold')}>{typeData.ignoreThreshold}</DataRow>;
        break;
    case 'jplag':
        typeDataUI = (
            <DataRow label={t('plagiarism.jplag.tune')}>
                {typeData.tune || t('plagiarism.jplag.tuneAutomatic') /* tune = 0 means automatic */}
            </DataRow>
        );
        break;
    default:
        // Should not happen
        break;
    }

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{report.name}</CustomCardTitle>
                {isActualSemester
                    ? (
                        <ButtonGroup>
                            <ToolbarButton
                                icon={faEdit}
                                text={t('common.edit')}
                                onClick={onEdit}
                            />
                            <DeleteToolbarButton onDelete={onDelete} itemName={report.name} />
                        </ButtonGroup>
                    )
                    : null}
            </CustomCardHeader>
            <DataRow label={t('plagiarism.type')}>{t(`plagiarism.${report.typeSpecificData.type}.name`)}</DataRow>
            {typeDataUI}
            <DataRow label={t('common.description')}>
                <MultiLineTextBlock text={report.description} />
            </DataRow>
        </CustomCard>
    );
}
