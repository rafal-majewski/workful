const symbols = require("./utils/symbols.js");
const createServer = require("./createServer.js");
const middlewares = require("./utils/middlewares.js");
// const static = require("./static.js");

module.exports = {
	createServer,
	symbols,
	middlewares,
	// static,
};
