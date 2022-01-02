const symbols = require("./symbols.js");
const {
	ANY_SUBROUTE,
	PATH_PARAM_NAME,
} = symbols;
const bindings = require("./bindings.js");
const createApplyNotFound = require("./utils/createApplyNotFound.js");
const createApplyMiddleware = require("./utils/createApplyMiddleware.js");
const createApplyMethodNotAllowed = require("./utils/createApplyMethodNotAllowed.js");
const createApplyInternalError = require("./utils/createApplyInternalError.js");

const createServer = (router) => {
	return require("http").createServer(async (req, res, errorCallback = (error, req, res) => (console.error(error))) => {
		bindings.statusCode(res);
		bindings.contentType(res);
		bindings.endJson(res);
		bindings.endText(res);
		bindings.setCookie(res);
		bindings.getBody(req);
		bindings.getQueryAndFragment(req);
		bindings.getDividedPath(req);
		bindings.getHeaders(req);
		bindings.getMiddlewarewareData(req);
		bindings.getPathParams(req);

		const applyMiddleware = createApplyMiddleware(req, res);
		const applyNotFound = createApplyNotFound(req, res);
		const applyMethodNotAllowed = createApplyMethodNotAllowed(req, res);
		const applyInternalError = createApplyInternalError(req, res);

		let route = router;

		const dividedPath = req.getDividedPath();
		const pathParams = req.getPathParams();
		try {
			if (await applyMiddleware(route)) return;
			for (let i = 0; i < dividedPath.length; ++i) {
				const subrouteName = dividedPath[i];
				if (!route[subrouteName]) {
					if (!route[ANY_SUBROUTE]) {
						if (await applyNotFound(route)) return;
					}
					route = route[ANY_SUBROUTE];
				} else {
					route = route[subrouteName];
				}
				if (route[PATH_PARAM_NAME]) {
					pathParams[route[PATH_PARAM_NAME]] = dividedPath[i];
				}
				if (await applyMiddleware(route)) return;
			}
			if (!route[symbols[req.method]]) {
				if (await applyMethodNotAllowed(route)) return;
			}
			await route[symbols[req.method]](req, res);
		} catch (error) {
			applyInternalError(route);
			errorCallback(error, req, res);
		}
	});
};

module.exports = createServer;
