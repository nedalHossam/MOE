const Liferay = window.Liferay || {
	Language: {
		get: (key) => {
			return key;
		},
	},
	OAuth2: {
		getAuthorizeURL: () => '',
		getBuiltInRedirectURL: () => '',
		getIntrospectURL: () => '',
		getTokenURL: () => '',
		getUserAgentApplication: (_serviceName) => {},
	},
	OAuth2Client: {
		FromParameters: (_options) => {
			return {};
		},
		FromUserAgentApplication: (_userAgentApplicationId) => {
			return {};
		},
		fetch: (_url, _options = {}) => {},
	},
	ThemeDisplay: {
		getCompanyGroupId: () => window.Liferay?.ThemeDisplay?.getCompanyGroupId?.() || 20119,
		getPathThemeImages: () => window.Liferay?.ThemeDisplay?.getPathThemeImages?.() || '/o/classic-theme/images',
		getPortalURL: () => window.Liferay?.ThemeDisplay?.getPortalURL?.() || window.location.origin,
		getScopeGroupId: () => window.Liferay?.ThemeDisplay?.getScopeGroupId?.() || 20117,
		getSiteGroupId: () => window.Liferay?.ThemeDisplay?.getSiteGroupId?.() || 20117,
		getUserId: () => window.Liferay?.ThemeDisplay?.getUserId?.() || 0,
		getLanguageId: () => window.Liferay?.ThemeDisplay?.getLanguageId?.() || 'en_US',
		isSignedIn: () => {
			return window.Liferay?.ThemeDisplay?.isSignedIn?.() || false;
		},
	},
	authToken: window.Liferay?.authToken || '',
    on: (_event, _callback) => {
		if (window.Liferay?.on) {
			window.Liferay.on(_event, _callback);
		}
	},
    fire: (_event, _data) => {
		if (window.Liferay?.fire) {
			window.Liferay.fire(_event, _data);
		}
	},
};

export default Liferay;

