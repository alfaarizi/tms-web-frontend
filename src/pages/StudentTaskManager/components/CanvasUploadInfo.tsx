import { CustomCard } from '@/components/CustomCard/CustomCard';
import { CustomCardHeader } from '@/components/CustomCard/CustomCardHeader';
import { CustomCardTitle } from '@/components/CustomCard/CustomCardTitle';
import { useTranslation } from 'react-i18next';

export function CanvasUploadInfo() {
    const { t } = useTranslation();

    return (
        <CustomCard>
            <CustomCardHeader>
                <CustomCardTitle>{t('fileUpload.upload')}</CustomCardTitle>
            </CustomCardHeader>
            {t('task.canvasUpload')}
        </CustomCard>
    );
}
