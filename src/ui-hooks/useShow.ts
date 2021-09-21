import { useState } from 'react';

export function useShow() {
    const [show, setShow] = useState(false);

    return {
        show,
        toShow: () => setShow(true),
        toHide: () => setShow(false),
        toggle: () => setShow((old) => !old),
    };
}
