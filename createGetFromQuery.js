const createGetFromQuery = (query = {}) => ({
	float: (name, defaultValue) => {
		if (!(name in query)) {
			return defaultValue;
		}
		return Number(query[name] || undefined);
	},
	integer: (name, defaultValue) => {
		if (!(name in query)) {
			return defaultValue;
		}
		const number = Number(query[name] || undefined);
		return Number.isInteger(number) ? number : NaN;
	},
});

module.exports = createGetFromQuery;
