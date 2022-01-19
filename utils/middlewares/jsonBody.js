const {
	InvalidJsonBodyError,
	InvalidContentTypeError,
	NoBodyError,
} = require("../errors.js");

const jsonBody = async (req, res, data) => {
	if (["GET", "HEAD"].includes(req.method)) {
		throw new NoBodyError("No body expected");
	}
	if (req.getHeader("content-type") != "application/json") {
		throw new InvalidContentTypeError("Invalid content type");
	}
	return req.getBody().then((body) => {
		let jsonBody;
		try {
			jsonBody = JSON.parse(body.toString());
		} catch (error) {
			throw new InvalidJsonBodyError("Invalid json body");
		}
		data.jsonBody = jsonBody;
	});
};

module.exports = jsonBody;
