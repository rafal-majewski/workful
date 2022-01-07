const stringifyQueryParams = (queryParams) => (Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join("&"));

module.exports = stringifyQueryParams;