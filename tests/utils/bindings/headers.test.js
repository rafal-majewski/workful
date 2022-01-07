const bindings = require("../../../utils/bindings.js");
const {createServer} = require("http");
const axios = require("axios");

test("does getHeaders have host", async () => {
	const server = createServer((req, res) => {
		bindings.headers(req);
		expect(req.getHeaders()["host"]).toBe(`localhost:${server.address().port}`);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});

test("get host header", async () => {
	const server = createServer((req, res) => {
		bindings.headers(req);
		expect(req.getHeader("host")).toBe(`localhost:${server.address().port}`);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});
