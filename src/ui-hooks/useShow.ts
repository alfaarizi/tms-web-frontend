import { useEffect, useState } from 'react';

export function useShow(defaultState: boolean = false) {
    const [show, setShow] = useState(false);

    useEffect(() => setShow(defaultState), []);

    return {
        show,
        toShow: () => setShow(true),
        toHide: () => setShow(false),
        toggle: () => setShow((old) => !old),
    };
}
