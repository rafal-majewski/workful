const {SUBROUTE_NOT_FOUND} = require("../symbols.js");

const createApplyNotFound = (req, res) => {
	return (route) => {
		res.status(404);
		if (route[SUBROUTE_NOT_FOUND]) {
			route[SUBROUTE_NOT_FOUND](req, res);
			if (res.writableEnded) return true;
		} else {
			res.end();
			return true;
		}
	};
};

module.exports = createApplyNotFound;
