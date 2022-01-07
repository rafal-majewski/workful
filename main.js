const symbols = require("./utils/symbols.js");
const createServer = require("./utils/createServer.js");
const middlewares = require("./middlewares.js");
// const static = require("./static.js");

module.exports = {
	createServer,
	symbols,
	middlewares,
	// static,
};
