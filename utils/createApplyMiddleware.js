const {MIDDLEWARE} = require("../symbols.js");

const createApplyMiddleware = (req, res) => {
	return async (route) => {
		if (route[MIDDLEWARE]) {
			await route[MIDDLEWARE](req, res);
			if (res.writableEnded) return true;
		}
	};
};

module.exports = createApplyMiddleware;
