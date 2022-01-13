const cookiesUtils = require("./cookiesUtils.js");
const queryUtils = require("./queryUtils.js");

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
	res.setCookie = function (name, value) {
		const cookies = cookiesUtils.unheaderify(res.getHeader("set-cookie") || []);
		cookies[name] = value;
		this.setHeader("set-cookie", cookiesUtils.headerify(cookies));
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
	const rawQuery = req.url.match(/^[^?]*\?(.*)/)?.[1];
	const query = rawQuery == undefined ? undefined : decodeURIComponent(rawQuery);
	const queryParams = queryUtils.parse(query);
	req.getQuery = function () {
		return query;
	};
	req.getQueryParams = function () {
		return queryParams;
	};
	req.getQueryParam = function (name) {
		return queryParams?.[name];
	};
	req.rebuildQuery = function (newQueryParams) {
		return queryUtils.stringify({...queryParams, ...newQueryParams});
	};
};

const path = (req) => {
	const dividedPath = req.url.match(/^([^?]*)/)[1].split("/").filter(Boolean).map(decodeURIComponent);
	req.getDividedPath = function () {
		return dividedPath;
	};
	req.getPath = function () {
		return "/" + dividedPath.join("/");
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
	req.setPathParam = function (name, value) {
		pathParams[name] = value;
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

module.exports = {
	statusCode,
	contentType,
	end,
	cookie,
	body,
	query,
	path,
	pathParams,
	headers,
};
