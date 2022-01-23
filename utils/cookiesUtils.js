const headerify = (cookies) => (
	Object.values(cookies).map(({name, value, options}) => (
		[
			`${name}=${value}`, ...Object.entries(options).filter(([, optionValue]) => (optionValue !== false)).map(([optionKey, optionValue]) => (
				`${optionKey}${[true, null].includes(optionValue) ? "" : `=${optionValue}`}`
			))
		].join("; ")
	))
);

const unheaderify = (headerifiedCookies) => (
	Object.fromEntries(
		headerifiedCookies.map((headerifiedCookie) => (
			((
				[[name, value], ...options]
			) => (
				[name, {name, value, options: Object.fromEntries(options)}]
			))(
				headerifiedCookie.split(";").map((cookiePart) => (
					cookiePart.split("=")
				)).map(([key, value]) => (
					[key.trim(), value?.trim() ?? true]
				))
			)
		)
	))
);



module.exports = {
	headerify,
	unheaderify,
};
