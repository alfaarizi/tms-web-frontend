import { IMAGE_TOKEN_LOCAL_STORAGE_KEY } from '@/constants/localStorageKeys';

export function createImageUrl(imageUrl: string) {
    const imageToken = localStorage.getItem(IMAGE_TOKEN_LOCAL_STORAGE_KEY) || '';

    return `${import.meta.env.VITE_API_BASE_URL}/${imageUrl}?imageToken=${imageToken}`;
}
