const parseQuery = (query) => query?.split("&").reduce((query, rawKeyAndValue) => {
	const {key, value} = rawKeyAndValue.match(/(?<key>[^=]*)(=(?<value>.*))?/).groups;
	if (key) query[key] = value === undefined ? null : value;
	return query;
}, {}) || null;

module.exports = parseQuery;
