const workful = require("./main.js");


const server = workful.createServer([
	(req, res) => {
		res.setStatusCode(200);
	},
	(req, res) => {
		res.end();
	},
]);

server.listen(4231);