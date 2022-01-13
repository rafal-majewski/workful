const parse = (query) => query?.split("&").reduce((query, rawKeyAndValue) => {
	const {key, value} = rawKeyAndValue.match(/(?<key>[^=]*)(=(?<value>.*))?/).groups;
	if (key) query[key] = value === undefined ? null : value;
	return query;
}, {}) || null;

const stringify = (queryParams) => (
	Object.entries(queryParams).map(
		([key, value]) => (
			`${key}${value == null ? "" : `=${value}`}`
		)
	).join("&")
);

module.exports = {
	parse,
	stringify,
};
