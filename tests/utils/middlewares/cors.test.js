const createServer = require("../../../createServer.js");
const middlewares = require("../../../utils/middlewares.js");
const {
	GET,
} = require("../../../utils/methodsSymbols.js");
const axios = require("axios");

test("cors", async () => {
	const server = createServer([
		middlewares.cors,
		{
			[GET]: (req, res) => {
				res.setStatusCode(200).end();
			},
		},
	]);

	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).then((response) => {
		expect(response.headers).toHaveProperty("access-control-allow-origin", "*");
	}).finally(() => {
		server.close();
	});
});
