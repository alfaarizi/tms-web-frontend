import { FileUpload } from '@/components/FileUpload';
import { faPaste } from '@fortawesome/free-solid-svg-icons';

import { ToolbarButton } from '@/components/Buttons/ToolbarButton';
import { DeleteToolbarButton } from '@/components/Buttons/DeleteToolbarButton';
import { useTranslation } from 'react-i18next';

import {
    useQuizImages,
    useQuizImageUploadMutation,
    useRemoveQuizImageMutation,
} from '@/hooks/instructor/QuizQuestionSetHooks';
import { ImageGallery } from '@/components/ImageGallery/ImageGallery';
import { getFirstError } from '@/utils/getFirstError';
import { ImageGalleryInsertFunc } from '@/components/Markdown/MarkdownEditor/MarkdownEditor';

type GalleryProps = {
    questionSetID: number;
    insertFunc: ImageGalleryInsertFunc
}

export function QuizImageGallery({
    insertFunc,
    questionSetID,
}: GalleryProps) {
    const { t } = useTranslation();
    const images = useQuizImages(questionSetID);
    const removeMutation = useRemoveQuizImageMutation(questionSetID);
    const uploadMutation = useQuizImageUploadMutation(questionSetID);

    const handleRemove = (filename: string) => {
        removeMutation.mutate(filename);
    };

    const handleUpload = (files: File[]) => {
        uploadMutation.mutate(files);
    };

    const failedToUpload: string[] | undefined = uploadMutation.data
        ?.failed.map((f) => {
            const firstError = getFirstError(f.cause);
            if (firstError) {
                return `${f.name}: ${firstError}`;
            }
            return f.name;
        });

    return (
        <>
            <ImageGallery
                images={images.data}
                renderButtons={((img) => (
                    <>
                        <ToolbarButton
                            icon={faPaste}
                            text={t('common.insert')}
                            displayTextBreakpoint="none"
                            onClick={() => insertFunc(img.url)}
                        />
                        <DeleteToolbarButton
                            displayTextBreakpoint="none"
                            onDelete={() => handleRemove(img.name)}
                        />
                    </>
                ))}
            />

            <FileUpload
                multiple
                loading={uploadMutation.isLoading}
                errorMessages={failedToUpload}
                successCount={uploadMutation.data ? uploadMutation.data.uploaded.length : 0}
                onUpload={handleUpload}
                accept="image/*"
            />
        </>
    );
}
