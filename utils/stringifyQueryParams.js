const stringifyQueryParams = (queryParams) => (
	Object.entries(queryParams).map(
		([key, value]) => (
			`${key}${value == null ? "" : `=${value}`}`
		)
	).join("&")
);

module.exports = stringifyQueryParams;