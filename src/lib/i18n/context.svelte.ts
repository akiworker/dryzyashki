import { getContext, setContext } from 'svelte';
import { en } from './locales/en';
import { ru } from './locales/ru';
import {
	LOCALE_STORAGE_KEY,
	detectInitialLocale,
	detectLocaleFromGeo,
	readStoredLocale
} from './detect';
import type { Locale, Translations } from './types';

const I18N_KEY = Symbol('i18n');

export type I18nContext = {
	readonly locale: Locale;
	readonly t: Translations;
	setLocale: (locale: Locale) => void;
	refineFromGeo: () => Promise<void>;
};

export function createI18nContext(): I18nContext {
	let locale = $state<Locale>(detectInitialLocale());
	const t = $derived(locale === 'ru' ? ru : en);

	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.lang = locale;
		}
	});

	return {
		get locale() {
			return locale;
		},
		get t() {
			return t;
		},
		setLocale(next) {
			locale = next;
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(LOCALE_STORAGE_KEY, next);
			}
		},
		async refineFromGeo() {
			if (readStoredLocale()) return;

			const geoLocale = await detectLocaleFromGeo();
			if (geoLocale) {
				locale = geoLocale;
			}
		}
	};
}

export function setI18nContext(ctx: I18nContext) {
	setContext(I18N_KEY, ctx);
}

export function useI18n(): I18nContext {
	return getContext<I18nContext>(I18N_KEY);
}

export async function refineLocaleFromGeo(ctx: I18nContext) {
	if (readStoredLocale()) return;

	const geoLocale = await detectLocaleFromGeo();
	if (geoLocale) {
		ctx.setLocale(geoLocale);
	}
}
