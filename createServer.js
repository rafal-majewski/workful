const symbols = require("./utils/symbols.js");
const {
	ANY_SUBROUTE,
	PATH_PARAM_NAME,
	MIDDLEWARE,
	SUBROUTE_NOT_FOUND,
	METHOD_NOT_ALLOWED,
	INTERNAL_ERROR,
} = symbols;
const methodsSymbols = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH", "TRACE", "CONNECT"].map((method) => (symbols[method]));
const bindings = require("./utils/bindings.js");
const applyCreators = require("./utils/applyCreators.js");


const createServer = (router, callbacks = {}) => {
	const {
		startCallback = () => {},
		errorCallback = (req, res, error) => (console.error(error)),
	} = callbacks;
	return require("http").createServer(async (req, res) => {
		bindings.statusCode(res);
		bindings.contentType(res);
		bindings.end(res);
		bindings.cookie(res);
		bindings.body(req);
		bindings.query(req);
		bindings.path(req);
		bindings.headers(req);
		bindings.middlewarewareData(req);
		bindings.pathParams(req);
		startCallback(req, res);
		const applyMiddleware = applyCreators[MIDDLEWARE](req, res);
		const applySubrouteNotFound = applyCreators[SUBROUTE_NOT_FOUND](req, res);
		const applyMethodNotAllowed = applyCreators[METHOD_NOT_ALLOWED](req, res);
		const applyInternalError = applyCreators[INTERNAL_ERROR](req, res);

		let route = router;

		const dividedPath = req.getDividedPath();
		const pathParams = req.getPathParams();
		try {
			if (await applyMiddleware(route)) return;
			for (let i = 0; i < dividedPath.length; ++i) {
				const subrouteName = dividedPath[i];
				if (!route[subrouteName]) {
					if (!route[ANY_SUBROUTE]) {
						return await applySubrouteNotFound(route);
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
				if (methodsSymbols.some((methodSymbol) => route[methodSymbol])) {
					return await applyMethodNotAllowed(route);
				} else {
					return await applySubrouteNotFound(route);
				}
			}
			route[symbols[req.method]](req, res);
		} catch (error) {
			applyInternalError(route);
			errorCallback(req, res, error);
		}
	});
};

module.exports = createServer;
