const bindings = require("../../../utils/bindings.js");
const {createServer} = require("http");
const axios = require("axios");

test("return value", async () => {
	const server = createServer((req, res) => {
		bindings.statusCode(res);
		expect(res.setStatusCode(200)).toBe(res);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});

test("if sets statusCode", async () => {
	const server = createServer((req, res) => {
		bindings.statusCode(res);
		res.setStatusCode(200);
		expect(res.statusCode).toBe(200);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});

test("if gets statusCode", async () => {
	const server = createServer((req, res) => {
		bindings.statusCode(res);
		res.setStatusCode(200);
		expect(res.getStatusCode()).toBe(200);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});
