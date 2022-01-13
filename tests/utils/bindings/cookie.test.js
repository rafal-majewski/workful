const bindings = require("../../../utils/bindings.js");
const {createServer} = require("http");
const axios = require("axios");

test("if sets correct header for 1 cookie", async () => {
	const server = createServer((req, res) => {
		bindings.cookie(res);
		res.setCookie("hello", "world");
		expect(res.getHeader("set-cookie")).toEqual(["hello=world;"]);
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
		bindings.cookie(res);
		res.setCookie("hello", "world");
		res.setCookie("foo", "bar");
		expect(res.getHeader("set-cookie")).toEqual(["hello=world;", "foo=bar;"]);
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});
