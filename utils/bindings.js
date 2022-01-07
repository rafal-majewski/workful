const stringifyCookies = require("./stringifyCookies.js");
const stringifyQueryParams = require("./stringifyQueryParams.js");
const parseQuery = require("./parseQuery.js");

const statusCode = (res) => {
	res.setStatusCode = function (statusCode) {
		this.statusCode = statusCode;
		return this;
	};
	res.getStatusCode = function () {
		return this.statusCode;
	}
};

const contentType = (res) => {
	res.setContentType = function (contentType) {
		this.setHeader("Content-Type", contentType);
		return this;
	};
	res.getContentType = function () {
		return this.getHeader("Content-Type");
	}
};

const end = (res) => {
	res.endJson = function (obj) {
		this.setHeader("Content-Type", "application/json");
		return this.end(JSON.stringify(obj));
	};
	res.endText = function (text) {
		this.setHeader("Content-Type", "text/plain");
		return this.end(text);
	};
};

const cookie = (res) => {
	const cookiesToSet = {};
	res.setCookie = function (name, value) {
		cookiesToSet[name] = value;
		this.setHeader("Set-Cookie", stringifyCookies(cookiesToSet));
		return this;
	}
};

const body = (req) => {
	req.getBody = function () {
		const fetchingBody = new Promise((resolve, reject) => {
			let rawBody = [];
			req.on("error", reject);
			req.on("data", (chunk) => {
				rawBody.push(chunk);
			});
			req.on("end", () => {
				resolve(Buffer.concat(rawBody));
			});
		});
		return (req.getBody = function () {
			return fetchingBody;
		})();
	};
};

const query = (req) => {
	const query = req.url.match(/^[^?]*\?(.*)/)?.[1] ?? null;
	const queryParams = parseQuery(query);
	req.getQuery = function () {
		return query;
	};
	req.getQueryParams = function () {
		return queryParams;
	};
	req.getQueryParam = function (name, defaultValue) {
		if (!(name in (queryParams || {}))) {
			return defaultValue;
		}
		return queryParams[name];
	};
	req.rebuildQuery = function (newQueryParams) {
		return stringifyQueryParams({...queryParams, ...newQueryParams});
	};
};

const dividedPath = (req) => {
	const dividedPath = req.url.match(/^([^?]*)/)[1].split("/").filter(Boolean);
	req.getDividedPath = function () {
		return dividedPath;
	};
};

const pathParams = (req) => {
	const pathParams = {};
	req.getPathParams = function () {
		return pathParams;
	};
	req.getPathParam = function (name) {
		return pathParams[name];
	};
};

const headers = (req) => {
	req.getHeaders = function () {
		return req.headers;
	};
	req.getHeader = function (name) {
		return req.headers[name];
	};
};

const middlewarewareData = (req) => {
	const middlewaresData = {};
	req.getMiddlewareData = function (name) {
		return middlewaresData[name];
	};
	req.setMiddlewareData = function (name, value) {
		middlewaresData[name] = value;
	};
};

module.exports = {
	statusCode,
	contentType,
	end,
	cookie,
	body,
	query,
	dividedPath,
	pathParams,
	headers,
	middlewarewareData,
};
