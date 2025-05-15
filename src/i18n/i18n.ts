import i18n, { BackendModule, Resource } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export type TranslationTopContent = Resource & { autonym: string };

const modules = import.meta.glob('./languages/*.json');

const supportedLngs: string[] = Object.keys(modules)
    .map((path) => path.match(/([^/]+)\.json$/)?.[1])
    .filter((path) => path !== undefined);

const customBackend: BackendModule = {
    type: 'backend',
    init: () => {},
    read: async (language: string, _namespace: string, callback: any) => {
        try {
            const path = `./languages/${language}.json`;
            const module = modules[path] as () => Promise<TranslationTopContent>;
            const translation = (await module()).default;
            callback(null, translation);
        } catch (error) {
            callback(error, null);
        }
    },
};

// Maintain correct language in html tag
i18n.on('languageChanged', (lng: string) => {
    document.documentElement.lang = lng.substring(0, 2);
});

const envPrefix = import.meta.env.VITE_ENV_PREFIX || '';
i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(LanguageDetector)
    .use(customBackend)
    .init({
        detection: {
            order: ['querystring', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
            lookupLocalStorage: `${envPrefix}i18nextLng`,
        },
        supportedLngs,
        fallbackLng: 'en-US',
        preload: supportedLngs,
        keySeparator: '.',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        backend: {},
    });

export default i18n;
