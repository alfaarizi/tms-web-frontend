import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import hu from 'i18n/hu.json';
import enUS from 'i18n/enUS.json';

const resources = {
    hu: {
        name: 'Magyar',
        translation: hu,
    },
    'en-US': {
        name: 'English',
        translation: enUS,
    },
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'hu',
        keySeparator: '.',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;

interface LanguageList {
    [key: string] : {name: string}
}

export const languages = resources as LanguageList;
