const headerify = (cookies) => (
	Object.entries(cookies).map(([name, value]) => (
		`${name}=${value};`
	))
);

const unheaderify = (headerifiedCookies) => (
	Object.fromEntries(
		headerifiedCookies.map((headerifiedCookie) => (
			headerifiedCookie.match(/^[\s,]*([^\s,=]*)=(.*);[\s,]*$/)?.slice(1, 3)
		)).filter(Boolean)
	)
);


module.exports = {
	headerify,
	unheaderify,
};
