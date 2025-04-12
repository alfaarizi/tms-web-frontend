import axios from 'axios';
import { useEffect, useState } from 'react';
import { createFrontendUrl } from '@/utils/createFrontendUrl';

import brandingDefault from '@/branding.dist.json';

export type Branding = {
    organizationName: Record<string, string>;
}

function getDefaultBranding() : Branding {
    return brandingDefault;
}

async function getLocalBranding() : Promise<Branding> {
    let branding = brandingDefault;
    await axios.get(createFrontendUrl('branding.json'))
        .then((response) => {
            const brandingLocal = response.data;
            branding = { ...brandingDefault, ...brandingLocal };
        })
        .catch(() => {
            branding = brandingDefault;
        });

    return branding;
}

export function useBranding() : Branding {
    const [branding, setBranding] = useState<Branding>(getDefaultBranding());

    useEffect(() => {
        getLocalBranding()
            .then((data) => {
                setBranding(data);
            })
            .catch(() => {
                console.error('Could not fetch local branding information.');
            });
    }, []);

    return branding;
}
