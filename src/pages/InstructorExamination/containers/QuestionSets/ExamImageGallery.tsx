import React from 'react';
import { FileUpload } from 'components/FileUpload';
import { faPaste } from '@fortawesome/free-solid-svg-icons';

import { InsertFunc } from 'components/ReactMdeWithCommands';
import { ToolbarButton } from 'components/Buttons/ToolbarButton';
import { DeleteButton } from 'components/Buttons/DeleteButton';

import {
    useExamImages,
    useExamImageUploadMutation,
    useRemoveExamImageMutation,
} from 'hooks/instructor/ExamQuestionSetHooks';

import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { getFirstError } from 'utils/getFirstError';

type GalleryProps = {
    questionSetID: number;
    insertFunc: InsertFunc
}

export function ExamImageGallery({
    insertFunc,
    questionSetID,
}: GalleryProps) {
    const images = useExamImages(questionSetID);
    const removeMutation = useRemoveExamImageMutation(questionSetID);
    const uploadMutation = useExamImageUploadMutation(questionSetID);

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
                        <ToolbarButton icon={faPaste} onClick={() => insertFunc(img.url)} />
                        <DeleteButton showText={false} onDelete={() => handleRemove(img.name)} />
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
