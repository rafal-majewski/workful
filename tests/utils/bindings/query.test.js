const bindings = require("../../../utils/bindings.js");
const {createServer} = require("http");
const axios = require("axios");

test("no query", async () => {
	const server = createServer((req, res) => {
		bindings.query(req);
		expect(req.getQuery()).toBe(null);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});

test("query params with one param without value", async () => {
	const server = createServer((req, res) => {
		bindings.query(req);
		expect(req.getQueryParams()).toEqual({a: null});
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}?a`).finally(() => {
		server.close();
	});
});

test("query params with one param with value", async () => {
	const server = createServer((req, res) => {
		bindings.query(req);
		expect(req.getQueryParams()).toEqual({a: "b"});
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}?a=b`).finally(() => {
		server.close();
	});
});

test("get query param", async () => {
	const server = createServer((req, res) => {
		bindings.query(req);
		expect(req.getQueryParam("a")).toBe("b");
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}?a=b`).finally(() => {
		server.close();
	});
});

test("get query param with default value", async () => {
	const server = createServer((req, res) => {
		bindings.query(req);
		expect(req.getQueryParam("test", "c")).toBe("c");
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}?a=b`).finally(() => {
		server.close();
	});
});
