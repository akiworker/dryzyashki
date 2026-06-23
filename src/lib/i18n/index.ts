export type { Locale, Translations } from './types';
export {
	LOCALE_STORAGE_KEY,
	RUSSIAN_ZONE_COUNTRIES,
	detectInitialLocale,
	detectLocaleFromGeo,
	localeFromCountry
} from './detect';
export {
	createI18nContext,
	setI18nContext,
	useI18n,
	type I18nContext
} from './context.svelte';
