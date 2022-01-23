const bindings = require("../../../utils/bindings.js");
const {createServer} = require("http");
const axios = require("axios");

test("if sets correct header for 1 cookie", async () => {
	const server = createServer((req, res) => {
		bindings.resCookie(res);
		res.setCookie("hello", "world");
		expect(res.getHeader("set-cookie")).toEqual(["hello=world"]);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});

test("if sets correct header for 2 cookies", async () => {
	const server = createServer((req, res) => {
		bindings.resCookie(res);
		res.setCookie("hello", "world");
		res.setCookie("foo", "bar");
		expect(res.getHeader("set-cookie")).toEqual(["hello=world", "foo=bar"]);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});

test("getting cookie", async () => {
	const server = createServer((req, res) => {
		bindings.resCookie(res);
		res.setCookie("hello", "world");
		expect(res.getCookie("hello")).toEqual({name: "hello", value: "world", options: {}});
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});

test("getting cookies", async () => {
	const server = createServer((req, res) => {
		bindings.resCookie(res);
		res.setCookie("hello", "world");
		res.setCookie("foo", "bar");
		expect(res.getCookies()).toEqual({
			hello: {name: "hello", value: "world", options: {}},
			foo: {name: "foo", value: "bar", options: {}
		}});
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});

test("if sets correct header for 1 cookie with max age", async () => {
	const server = createServer((req, res) => {
		bindings.resCookie(res);
		res.setCookie("hello", "world", {["max-age"]: 1000});
		expect(res.getHeader("set-cookie")).toEqual(["hello=world; max-age=1000"]);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});

test("if axios gets correct cookie with max age", async () => {
	const server = createServer((req, res) => {
		bindings.resCookie(res);
		res.setCookie("hello", "world", {["max-age"]: 1000});
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).then((response) => {
		expect(response.headers["set-cookie"]).toEqual(["hello=world; max-age=1000"]);
	}).finally(() => {
		server.close();
	});
});
