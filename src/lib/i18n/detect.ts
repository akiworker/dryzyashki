import type { Locale } from './types';

export const LOCALE_STORAGE_KEY = 'dryzyashki-lang';

/** Страны, где показываем русскую версию */
export const RUSSIAN_ZONE_COUNTRIES = new Set([
	'RU', // Россия
	'UA', // Украина
	'KZ', // Казахстан
	'BY', // Беларусь
	'MD', // Молдова
	'MN', // Монголия
	'UZ', // Узбекистан
	'KG', // Кыргызстан
	'TJ', // Таджикистан
	'TM', // Туркменистан
	'AM', // Армения
	'AZ' // Азербайджан
]);

/** Языки браузера → русская версия (запасной вариант до гео) */
export const RUSSIAN_ZONE_LANGUAGES = new Set([
	'ru',
	'uk',
	'be',
	'kk',
	'ky',
	'tg',
	'uz',
	'az',
	'hy',
	'mn',
	'mo'
]);

export function isLocale(value: string | null): value is Locale {
	return value === 'ru' || value === 'en';
}

export function localeFromCountry(countryCode: string | null | undefined): Locale | null {
	if (!countryCode) return null;
	return RUSSIAN_ZONE_COUNTRIES.has(countryCode.toUpperCase()) ? 'ru' : 'en';
}

export function localeFromBrowserLanguages(languages: readonly string[]): Locale {
	for (const language of languages) {
		const code = language.toLowerCase().split('-')[0];
		if (RUSSIAN_ZONE_LANGUAGES.has(code)) return 'ru';
	}
	return 'en';
}

export function readStoredLocale(): Locale | null {
	if (typeof localStorage === 'undefined') return null;
	const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
	return isLocale(stored) ? stored : null;
}

export function detectInitialLocale(): Locale {
	const stored = readStoredLocale();
	if (stored) return stored;

	if (typeof navigator === 'undefined') return 'en';

	return localeFromBrowserLanguages(navigator.languages?.length ? navigator.languages : [navigator.language]);
}

export async function fetchCountryCode(): Promise<string | null> {
	try {
		const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
			signal: AbortSignal.timeout(4000)
		});

		if (!response.ok) return null;

		const text = await response.text();
		const match = text.match(/loc=([A-Z]{2})/);
		return match?.[1] ?? null;
	} catch {
		return null;
	}
}

export async function detectLocaleFromGeo(): Promise<Locale | null> {
	const country = await fetchCountryCode();
	return localeFromCountry(country);
}
