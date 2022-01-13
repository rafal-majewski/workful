const bindings = require("../../../utils/bindings.js");
const {createServer} = require("http");
const axios = require("axios");

test("no query", async () => {
	const server = createServer((req, res) => {
		bindings.query(req);
		expect(req.getQuery()).toBe(undefined);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});

test("no query (null)", async () => {
	const server = createServer((req, res) => {
		bindings.query(req);
		expect(req.getQuery()).toBe("");
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}/?`).finally(() => {
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

test("get query param ok", async () => {
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

test("rebuild query without overwrite", async () => {
	const server = createServer((req, res) => {
		bindings.query(req);
		expect(req.rebuildQuery({"c": "d"})).toBe("a=b&c=d");
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}?a=b`).finally(() => {
		server.close();
	});
});

test("rebuild query with overwrite", async () => {
	const server = createServer((req, res) => {
		bindings.query(req);
		expect(req.rebuildQuery({"test": "12"})).toBe("a=b&test=12");
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}?a=b&test=abc`).finally(() => {
		server.close();
	});
});

test("get query param non-existing", async () => {
	const server = createServer((req, res) => {
		bindings.query(req);
		expect(req.getQueryParam("test")).toBe(undefined);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});
