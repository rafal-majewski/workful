const bindings = require("../../../utils/bindings.js");
const {createServer} = require("http");
const axios = require("axios");

test("get middleware data undefined", async () => {
	const server = createServer((req, res) => {
		bindings.middlewarewareData(res);
		expect(res.getMiddlewareData("test")).toBe(undefined);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});

test("set and get middleware data", async () => {
	const server = createServer((req, res) => {
		bindings.middlewarewareData(res);
		res.setMiddlewareData("test", "abc");
		expect(res.getMiddlewareData("test")).toBe("abc");
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});
