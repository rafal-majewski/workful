const methodsSymbols = require("./utils/methodsSymbols.js");

const {
	MethodNotAllowedError,
	NotFoundError,
	InvalidResolverError,
} = require("./utils/errors.js");

const bindings = require("./utils/bindings.js");


const rootErrorHandler = async (req, res, data, next) => {
	try {
		await next();
	} catch (err) {
		if (res.writableEnded) return console.error(err);
		try {
			res.setHeader("content-type", "text/plain");
			if ("httpStatusCode" in err) {
				return res.setStatusCode(err.httpStatusCode).end(`${err.httpStatusCode} ${err.name}: ${err.message}`);
			}
			throw err;
		} catch (err) {
			console.error(err);
			res.setStatusCode(500).end("Internal server error");
		}
	}
};

const createServer = (router) => {
	const wrappedRouter = [
		rootErrorHandler,
		router,
	];
	return require("http").createServer(async (req, res) => {
		bindings.statusCode(res);
		bindings.contentType(res);
		bindings.end(res);
		bindings.reqCookie(req);
		bindings.resCookie(res);
		bindings.body(req);
		bindings.query(req);
		bindings.path(req);
		bindings.headers(req);
		bindings.pathParams(req);

	
		const traverse = async (route, dividedPathTraversed, dividedPathToTraverse, data, next) => {
			if (Array.isArray(route)) {
				const resolver = route[0];
				if (route.length === 1) {
					return traverse(resolver, dividedPathTraversed, dividedPathToTraverse, data, null);
				}
				if (route.length > 1) {
					if (typeof resolver === "function" && resolver.length < 4) {
						await resolver(req, res, data);
						return traverse(route.slice(1), dividedPathTraversed, dividedPathToTraverse, data, next);
					}
					return traverse(resolver, dividedPathTraversed, dividedPathToTraverse, data, () => (
						traverse(route.slice(1), dividedPathTraversed, dividedPathToTraverse, data, next)
					));
				}
				throw new InvalidResolverError(req.getPath());
			}
			if (typeof route === "function") {
				return route(req, res, data, next);
			}
			if (typeof route === "object") {
				if (dividedPathToTraverse.length === 0) {
					if (req.method === "OPTIONS") {
						const allowedMethods = Reflect.ownKeys(route).reduce((allowedMethods, routeKey) => {
							if (typeof routeKey === "symbol") {
								const method = routeKey.description;
								allowedMethods.push(method);
								if (method === "GET") allowedMethods.push("HEAD");
							}
							return allowedMethods;
						}, ["OPTIONS"]);
						if (allowedMethods.length <= 1) {
							throw new NotFoundError(req.getPath());
						}
						if (req.getHeader("access-control-request-method")) {
							return res.setStatusCode(204).setHeader("access-control-allow-methods", allowedMethods.join(", ")).end();
						} else {
							return res.setStatusCode(204).setHeader("allow", allowedMethods.join(", ")).end();
						}
					}
					const resolver = route[methodsSymbols[req.method === "HEAD" ? "GET" : req.method]];
					if (!resolver) {
						if (Object.values(methodsSymbols).some((methodSymbol) => route[methodSymbol])) {
							throw new MethodNotAllowedError(`${req.method} ${req.getPath()}`);
						}
						throw new NotFoundError(req.getPath());
					}
					if (req.method === "HEAD") {
						const original_end = res.end;
						res.end = function(content) {
							this.setHeader("content-length", content.length);
							original_end.apply(this)
						}
					}
					return traverse(resolver, dividedPathTraversed, dividedPathToTraverse, data, next);
				}
				const resolver = route[dividedPathToTraverse[0]];
				if (!resolver) {
					const resolver = route[":"];
					if (!resolver) {
						throw new NotFoundError(req.getPath());
					}
					return traverse(
						resolver,
						dividedPathTraversed.concat(dividedPathToTraverse[0]),
						dividedPathToTraverse.slice(1),
						data,
						next,
					);
				}
				return traverse(
					resolver,
					dividedPathTraversed.concat(dividedPathToTraverse[0]),
					dividedPathToTraverse.slice(1),
					data,
					next,
				);
			}
			if (typeof route === "string") {
				req.setPathParam(route, dividedPathTraversed[dividedPathTraversed.length - 1]);
				return next();
			}
			throw new InvalidResolverError(req.getPath());
		};

		traverse(
			wrappedRouter,
			[],
			req.getDividedPath(),
			{},
			null
		);
	});
};

module.exports = createServer;
