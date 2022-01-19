const bindings = require("../../../utils/bindings.js");
const {createServer} = require("http");
const axios = require("axios");

test("getting existing cookie", async () => {
	const server = createServer((req, res) => {
		bindings.reqCookie(req);
		expect(req.getCookie("hello")).toEqual("world");
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`, {headers: {"Cookie": "hello=world"}}).finally(() => {
		server.close();
	});
});

test("getting nonexisting cookie", async () => {
	const server = createServer((req, res) => {
		bindings.reqCookie(req);
		expect(req.getCookie("hello")).toEqual(undefined);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`, {headers: {"Cookie": ""}}).finally(() => {
		server.close();
	});
});

test("getting nonexisting cookie with no cookies", async () => {
	const server = createServer((req, res) => {
		bindings.reqCookie(req);
		expect(req.getCookie("hello")).toEqual(undefined);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`, {headers: null}).finally(() => {
		server.close();
	});
});

test("getting cookies", async () => {
	const server = createServer((req, res) => {
		bindings.reqCookie(req);
		expect(req.getCookies()).toEqual({hello: "world", test: "abc"});
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`, {headers: {"Cookie": "hello=world;test=abc"}}).finally(() => {
		server.close();
	});
});
