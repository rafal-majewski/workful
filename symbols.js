const symbols = {
	GET: Symbol("GET"),
	POST: Symbol("POST"),
	PUT: Symbol("PUT"),
	DELETE: Symbol("DELETE"),
	HEAD: Symbol("HEAD"),
	OPTIONS: Symbol("OPTIONS"),
	PATCH: Symbol("PATCH"),
	TRACE: Symbol("TRACE"),
	CONNECT: Symbol("CONNECT"),
	SUBROUTE_NOT_FOUND: Symbol("NOT_FOUND"),
	METHOD_NOT_ALLOWED: Symbol("METHOD_NOT_ALLOWED"),
	MIDDLEWARE: Symbol("MIDDLEWARE"),
	ANY_SUBROUTE: Symbol("ANY_SUBROUTE"),
	PATH_PARAM_NAME: Symbol("PATH_PARAM_NAME"),
};

module.exports = symbols;
