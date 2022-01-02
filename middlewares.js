const jsonParseBody = ({
	wrongContentTypeErrorCallback = (req, res) => (res.end()),
	jsonParseErrorCallback = (req, res) => (res.end()),
}) => (
	(req, res) => {
		if (["GET", "HEAD"].includes(req.method)) {
			return;
		}
		if (req.getHeader("content-type") != "application/json") {
			res.status(415);
			wrongContentTypeErrorCallback(req, res);
			return;
		}
		return req.getBody().then((body) => {
			const middlewareData = req.getMiddlewareData();
			try {
				middlewareData.jsonBody = JSON.parse(body);
			} catch (error) {
				res.status(400);
				jsonParseErrorCallback(req, res);
			}
		});
	}
);

const combineMiddlewares = (...middlewares) => {
	return async (req, res) => {
		for (const middleware of middlewares) {
			await middleware(req, res);
		}
	};
};

module.exports = {
	jsonParseBody,
	combineMiddlewares,
};
