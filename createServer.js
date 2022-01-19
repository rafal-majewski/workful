const methodsSymbols = require("./utils/methodsSymbols.js");

// const {
// 	ANY_SUBROUTE,
// 	PATH_PARAM_NAME,
// } = specialSymbols;

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
		res.setHeader("content-type", "text/plain");
		if ("httpStatusCode" in err) {
			res.setStatusCode(err.httpStatusCode).end(err.message);
		} else {
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
		// const dividedPath = ;
		// const pathParams = req.getPathParams();

	
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
				throw new InvalidResolverError(`${req.getPath()}`);
			}
			if (typeof route === "function") {
				return route(req, res, data, next);
			}
			if (typeof route === "object") {
				if (dividedPathToTraverse.length === 0) {
					const resolver = route[methodsSymbols[req.method]];
					if (!resolver) {
						if (Object.values(methodsSymbols).some((methodSymbol) => route[methodSymbol])) {
							throw new MethodNotAllowedError(`${req.method} ${req.getPath}`);
						}
						throw new NotFoundError(req.getPath());
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
			throw new InvalidResolverError(`${req.getPath}`);
		};

		traverse(
			wrappedRouter,
			[],
			req.getDividedPath(),
			{},
			null
		);
		// const traverse = async (resolver, dividedPath) => {
		// 	if (Array.isArray(resolver)) {
		// 		for (const subresolver of resolver) {
		// 			await traverse(subresolver, dividedPath);
		// 		}
		// 	}
		// 	else if (typeof resolver === "function") {
		// 		return await resolver(req, res, middlewarewareData);
		// 	}
		// 	else if (typeof resolver === "object") {
		// 		if (dividedPath.length === 0) {
		// 			const finalSubresolver = resolver[methodsSymbols[req.method]];
		// 			if (!finalSubresolver) {
		// 				if (Object.values(methodsSymbols).some((methodSymbol) => resolver[methodSymbol])) {
		// 					throw new MethodNotAllowedError(`${req.method} ${req.getPath()}`);
		// 				}
		// 				throw new NotFoundError(req.getPath());
		// 			}
		// 			return await finalSubresolver(req, res, middlewarewareData);
		// 		}
		// 		const subrouteSubresolver = resolver[dividedPath[0]];
		// 		if (!subrouteSubresolver) {
		// 			const anySubrouteSubresolver = resolver[ANY_SUBROUTE];
		// 			if (!anySubrouteSubresolver) {
		// 				throw new NotFoundError(req.getPath());
		// 			}
		// 			const paramName = anySubrouteSubresolver[PATH_PARAM_NAME]
		// 			if (paramName) {
		// 				req.setPathParams(paramName, dividedPath[0]);
		// 			}
		// 			return await traverse(anySubrouteSubresolver, dividedPath.slice(1));
		// 		}
		// 		const paramName = subrouteSubresolver[PATH_PARAM_NAME]
		// 		if (paramName) {
		// 			req.setPathParams(paramName, dividedPath[0]);
		// 		}
		// 		return await traverse(subrouteSubresolver, dividedPath.slice(1));
		// 	} else {
		// 		throw new InvalidResolverError(resolver);
		// 	}
		// };
		// await traverse(router, req.getDividedPath());
		// try {
		// 	if (await applyMiddleware(route)) return;
		// 	for (let i = 0; i < dividedPath.length; ++i) {
		// 		const subrouteName = dividedPath[i];
		// 		if (!route[subrouteName]) {
		// 			if (!route[ANY_SUBROUTE]) {
		// 				return await applySubrouteNotFound(route);
		// 			}
		// 			route = route[ANY_SUBROUTE];
		// 		} else {
		// 			route = route[subrouteName];
		// 		}
		// 		if (route[PATH_PARAM_NAME]) {
		// 			pathParams[route[PATH_PARAM_NAME]] = dividedPath[i];
		// 		}
		// 		if (await applyMiddleware(route)) return;
		// 	}
		// 	if (!route[symbols[req.method]]) {
		// 		if (methodsSymbols.some((methodSymbol) => route[methodSymbol])) {
		// 			return await applyMethodNotAllowed(route);
		// 		} else {
		// 			return await applySubrouteNotFound(route);
		// 		}
		// 	}
		// 	route[symbols[req.method]](req, res);
		// } catch (error) {
		// 	applyInternalError(route);
		// }
	});
};

module.exports = createServer;
