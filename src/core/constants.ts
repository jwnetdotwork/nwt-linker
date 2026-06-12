import { PluginSettings } from './types';

export const DEFAULT_URL_TEMPLATE = 'https://www.jw.org/finder?srcid=jwlshare&wtlocale={{wtlocale}}&prefer=lang&bible={{bible}}&pub={{pub}}';

export const DEFAULT_SETTINGS: PluginSettings = {
	enabled: true,
	debounceMs: 1000,
	wtlocale: 'J',
	pub: 'nwtsty',
	urlTemplate: DEFAULT_URL_TEMPLATE,
	aliases: {}, // This will be populated from data/aliases.json at runtime or during initialization
};
