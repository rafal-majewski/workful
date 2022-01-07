const bindings = require("../../../utils/bindings.js");
const {createServer} = require("http");
const axios = require("axios");

test("return value", async () => {
	const server = createServer((req, res) => {
		bindings.contentType(res);
		expect(res.setContentType("text/plain")).toBe(res);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});

});

test("if sets contentType", async () => {
	const server = createServer((req, res) => {
		bindings.contentType(res);
		res.setContentType("text/plain");
		expect(res.getHeader("content-type")).toBe("text/plain");
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});

test("if gets contentType", async () => {
	const server = createServer((req, res) => {
		bindings.contentType(res);
		res.setContentType("text/plain");
		expect(res.getContentType()).toBe("text/plain");
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});
