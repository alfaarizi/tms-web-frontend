export function createImageUrl(imageUrl: string) {
    const imageToken = localStorage.getItem('imageToken') || '';

    return `${process.env.REACT_APP_API_BASEURL}/${imageUrl}?imageToken=${imageToken}`;
}
