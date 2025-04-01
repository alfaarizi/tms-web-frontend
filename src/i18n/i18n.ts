import i18n from 'i18next';
import LanguageDetector, { DetectorOptions } from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

/**
 * Webpack context (bits important for us).
 * @todo this should be imported from Webpack, but the definition is only available in v5.62+
 * @see https://github.com/webpack/webpack/pull/14597
 * @see https://github.com/webpack/webpack/releases/tag/v5.62.0
 */
interface Context {
    (key: string): any;
    keys(): string[];
}

interface LanguageList {
    [key: string]: {name: string};
}

interface TranslationContent {
    [key: string]: string|TranslationContent;
}

type TranslationTopContent = TranslationContent & {autonym: string};

const resources: {[language: string]: {translation: TranslationTopContent}} = {};
const autonyms: LanguageList = {};

function processLanguage(filename: string, translation: TranslationTopContent) {
    const code = filename.replace(/^.*\/([^/]+)\.json/, '$1');
    resources[code] = { translation };
    autonyms[code] = { name: translation.autonym };
}
function importAll(r: Context) {
    r.keys().forEach((key) => processLanguage(key, r(key)));
}
importAll((require as any).context('./languages', false, /\.json$/));

const envPrefix = process.env.REACT_APP_ENV_PREFIX || '';
const detectionOptions: DetectorOptions = {
    order: ['querystring', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
    lookupLocalStorage: `${envPrefix}i18nextLng`,
};
i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(LanguageDetector)
    .init({
        resources,
        detection: detectionOptions,
        supportedLngs: Object.keys(resources),
        fallbackLng: ['en-US'],
        keySeparator: '.',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
export const languages = autonyms;
