const bindings = require("../../../utils/bindings.js");
const {createServer} = require("http");
const axios = require("axios");

test("no path", () => {
	const server = createServer((req, res) => {
		bindings.path(req);
		expect(req.getPath()).toEqual("/");
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	axios.post(`http://localhost:${server.address().port}`, "abc").finally(() => {
		server.close();
	});
});

test("/", () => {
	const server = createServer((req, res) => {
		bindings.path(req);
		expect(req.getPath()).toEqual("/");
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	axios.post(`http://localhost:${server.address().port}/`).finally(() => {
		server.close();
	});
});

test("/abc", () => {
	const server = createServer((req, res) => {
		bindings.path(req);
		expect(req.getPath()).toEqual("/abc");
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	axios.post(`http://localhost:${server.address().port}/abc`).finally(() => {
		server.close();
	});
});

test("/abc/def", () => {
	const server = createServer((req, res) => {
		bindings.path(req);
		expect(req.getPath()).toEqual("/abc/def");
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	axios.post(`http://localhost:${server.address().port}/abc/def`).finally(() => {
		server.close();
	});
});



test("/abc///def", () => {
	const server = createServer((req, res) => {
		bindings.path(req);
		expect(req.getPath()).toEqual("/abc/def");
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	axios.post(`http://localhost:${server.address().port}/abc///def`).finally(() => {
		server.close();
	});
});

test("/abc///def getDividedPath", () => {
	const server = createServer((req, res) => {
		bindings.path(req);
		expect(req.getDividedPath()).toEqual(["abc", "def"]);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	axios.post(`http://localhost:${server.address().port}/abc///def`).finally(() => {
		server.close();
	});
});

test("/ getDividedPath", () => {
	const server = createServer((req, res) => {
		bindings.path(req);
		expect(req.getDividedPath()).toEqual([]);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	axios.post(`http://localhost:${server.address().port}/`).finally(() => {
		server.close();
	});
});
