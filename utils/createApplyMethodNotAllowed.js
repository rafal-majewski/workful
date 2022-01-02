const {METHOD_NOT_ALLOWED} = require("../symbols.js");

const createApplyMethodNotAllowed = (req, res) => {
	return (route) => {
		res.status(405);
		if (route[METHOD_NOT_ALLOWED]) {
			route[METHOD_NOT_ALLOWED](req, res);
			if (res.writableEnded) return true;
		} else {
			res.end();
			return true;
		}
	};
};

module.exports = createApplyMethodNotAllowed;
