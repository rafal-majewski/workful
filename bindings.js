const stringifyCookies = require("./utils/stringifyCookies.js");

const statusCode = (res) => {
	res.status = function (statusCode) {
		this.statusCode = statusCode;
		return this;
	};
};

const contentType = (res) => {
	res.contentType = function (contentType) {
		this.setHeader("Content-Type", contentType);
		return this;
	};
};

const endJson = (res) => {
	res.endJson = function (obj) {
		this.setHeader("Content-Type", "application/json");
		return this.end(JSON.stringify(obj));
	};
};

const endText = (res) => {
	res.endText = function (text) {
		this.setHeader("Content-Type", "text/plain");
		return this.end(text);
	};
};

const setCookie = (res) => {
	const cookiesToSet = {};
	res.cookie = function (name, value) {
		cookiesToSet[name] = value;
		this.setHeader("Set-Cookie", stringifyCookies(cookiesToSet));
		return this;
	}
};

const getBody = (req) => {
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

const getQueryAndFragment = (req) => {
	const {
		query,
		fragment,	
	} = (({rawQuery, rawFragment}) => ({
		query: rawQuery === undefined ? null : rawQuery.split("&").reduce((query, rawKeyAndValue) => {
			const {key, value} = rawKeyAndValue.match(/(?<key>[^=]*)(=(?<value>.*))?/).groups;
			query[key] = value === undefined ? null : value;
			return query;
		}, {}),
		fragment: rawFragment === undefined ? null : rawFragment,
	}))(req.url.match(/^[^\?#]*(?:\?(?<rawQuery>[^#]*))?(?:#(?<rawFragment>.*))?$/).groups);
	req.getQuery = function () {
		return query;
	};
	req.getQueryParam = function (name, defaultValue) {
		if (!(name in query)) {
			return defaultValue;
		}
		return query[name];
	};

	req.getFragment = function () {
		return fragment;
	};
};

const getDividedPath = (req) => {
	const dividedPath = req.url.match(/^[^?#]*/)[0].split("/").filter(Boolean);
	req.getDividedPath = function () {
		return dividedPath;
	};
};

const getPathParams = (req) => {
	const pathParams = {};
	req.getPathParams = function () {
		return pathParams;
	};
	req.getPathParam = function (name) {
		return pathParams[name];
	};
};

const getHeaders = (req) => {
	req.getHeaders = function () {
		return req.headers;
	};
	req.getHeader = function (name) {
		return req.headers[name];
	};
};

const getMiddlewarewareData = (req) => {
	const middlewareData = {};
	req.getMiddlewareData = function () {
		return middlewareData;
	};
};

module.exports = {
	statusCode,
	contentType,
	endJson,
	endText,
	setCookie,
	getBody,
	getQueryAndFragment,
	getDividedPath,
	getPathParams,
	getHeaders,
	getMiddlewarewareData,
};
