import { useMutation } from 'react-query';
import { saveAs } from 'file-saver';

export type DownloadFunc<T> = (param: T) => Promise<Blob>;

type DownloadParams<T> = {
    funcParams: T,
    fileName: string
}

export function useDownloader<T>(func: DownloadFunc<T>) {
    const mutation = useMutation((params: DownloadParams<T>) => func(params.funcParams), {
        onSuccess: (data, params) => {
            saveAs(data, params.fileName);
        },
    });

    const download = (fileName: string, funcParams: T) => {
        mutation.mutate({
            fileName,
            funcParams,
        });
    };

    const downloadAsync = async (fileName: string, funcParams: T) => {
        await mutation.mutateAsync({
            fileName,
            funcParams,
        });
    };

    return {
        isLoading: mutation.isLoading,
        error: mutation.error,
        download,
        downloadAsync,
    };
}
