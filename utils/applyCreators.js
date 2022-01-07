const {
	SUBROUTE_NOT_FOUND,
	MIDDLEWARE,
	INTERNAL_ERROR,
	METHOD_NOT_ALLOWED,
} = require("./symbols.js");

const createWithSymbolCreateApply = (symbol) => (req, res) => async (route) => {
	if (route[symbol]) {
		await route[symbol](req, res);
	}
	return res.writableEnded;
};

const wrapEndingResponse = (statusCode) => (symbol) => (req, res) => async (route) => {
	res.setStatusCode(statusCode);
	if (!await createWithSymbolCreateApply(symbol)(req, res)(route)) {
		res.end();
	}
	return res.writableEnded;
};

const applyCreators = {
	[SUBROUTE_NOT_FOUND]: wrapEndingResponse(404)(SUBROUTE_NOT_FOUND),
	[MIDDLEWARE]: createWithSymbolCreateApply(MIDDLEWARE),
	[INTERNAL_ERROR]: wrapEndingResponse(500)(INTERNAL_ERROR),
	[METHOD_NOT_ALLOWED]: wrapEndingResponse(405)(METHOD_NOT_ALLOWED),
};

module.exports = applyCreators;