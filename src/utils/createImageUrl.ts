import { IMAGE_TOKEN_LOCAL_STORAGE_KEY } from 'constants/localStorageKeys';
import { env } from 'runtime-env';

export function createImageUrl(imageUrl: string) {
    const imageToken = localStorage.getItem(IMAGE_TOKEN_LOCAL_STORAGE_KEY) || '';

    return `${env.REACT_APP_API_BASEURL}/${imageUrl}?imageToken=${imageToken}`;
}
