const methodsSymbols = require("./utils/methodsSymbols.js");
const createServer = require("./createServer.js");
const middlewares = require("./utils/middlewares.js");
const errors = require("./utils/errors.js");
// const static = require("./static.js");

module.exports = {
	createServer,
	methodsSymbols,
	middlewares,
	errors,
	// static,
};
