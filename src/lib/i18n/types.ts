export type Locale = 'ru' | 'en';

export type Translations = {
	meta: {
		title: string;
		description: string;
	};
	header: {
		features: string;
		team: string;
		langRu: string;
		langEn: string;
	};
	hero: {
		descLine1: string;
		descLine2: string;
		join: string;
		learnMore: string;
		toggleMusic: string;
	};
	features: {
		title: string;
		items: { title: string; desc: string }[];
	};
	fish: {
		title: string;
		buy: string;
		price: string;
		socials: string;
		confirmTitle: string;
		confirm: string;
		cancel: string;
		processing: string;
		confirmed: string;
		close: string;
	};
	team: {
		title: string;
		subtitle: string;
		hint: string;
		roles: {
			creator: string;
			admin: string;
		};
		subs: {
			loh: string;
		};
		throwTomato: string;
		close: string;
	};
	footer: {
		tagline: string;
		nav: string;
		links: string;
		features: string;
		team: string;
		madeBy: string;
	};
};
