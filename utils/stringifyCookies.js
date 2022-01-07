const stringifyCookies = (cookies) => {
	return Object.entries(cookies).map(([name, value]) => {
		return `${name}=${value};`;
	}).join(" ");
};

module.exports = stringifyCookies;
