const {INTERNAL_ERROR} = require("../symbols.js");

const createInternalError = (req, res) => {
	return (route) => {
		res.status(500);
		if (route[INTERNAL_ERROR]) {
			route[INTERNAL_ERROR](req, res);
			if (res.writableEnded) return true;
		} else {
			res.end();
			return true;
		}
	};
};

module.exports = createInternalError;
