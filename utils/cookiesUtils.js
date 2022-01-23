const headerify = (cookies) => (
	Object.entries(cookies).map(([name, {value, options}]) => (
		[`${name}=${value}`, ...Object.entries(options).map(([optionKey, optionValue]) => (
			optionValue === null ? optionKey : `${optionKey}=${optionValue}`
		))].join("; ")
	))
);

const unheaderify = (headerifiedCookies) => (
	Object.fromEntries(
		headerifiedCookies.map((headerifiedCookie) => (
			(([[name, value] = [], ...options]) => (
				name && [name, {value, options: Object.fromEntries(options)}]
			))(
				headerifiedCookie.split(";")
				.map((cookiePart) => (cookiePart.replace(/^[\s,]+|[\s,]+$/g, "")))
				.filter(Boolean)
				.map((cookiePart) => (cookiePart.match(/^([^=]+)=(.*)$/)?.slice(1, 3) || [cookiePart, null]))
			)
		)).filter(Boolean)
	)
);


module.exports = {
	headerify,
	unheaderify,
};
