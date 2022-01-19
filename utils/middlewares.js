const jsonBody = require("./middlewares/jsonBody.js");
const cors = require("./middlewares/cors.js");
const yup = require("./middlewares/yup.js");

module.exports = {
	jsonBody,
	cors,
	yup,
};
