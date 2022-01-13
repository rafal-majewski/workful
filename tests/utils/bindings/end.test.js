const bindings = require("../../../utils/bindings.js");
const {createServer} = require("http");
const axios = require("axios");

test("endText response result data", async () => {
	const server = createServer((req, res) => {
		bindings.end(res);
		res.statusCode = 200;
		res.endText("Hello World");
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).then(({data}) => {
		expect(data).toBe("Hello World");
	}).finally(() => {
		server.close();
	});
});

test("endText response result content-type header", async () => {
	const server = createServer((req, res) => {
		bindings.end(res);
		res.statusCode = 200;
		res.endText("Hello World");
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).then(({headers}) => {
		expect(headers["content-type"]).toBe("text/plain");
	}).finally(() => {
		server.close();
	});
});

test("endJson response result data", async () => {
	const server = createServer((req, res) => {
		bindings.end(res);
		res.statusCode = 200;
		res.endJson({hello: "world"});
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).then(({data}) => {
		expect(data).toEqual({hello: "world"});
	}).finally(() => {
		server.close();
	});
});

test("endJson response result content-type header", async () => {
	const server = createServer((req, res) => {
		bindings.end(res);
		res.statusCode = 200;
		res.endJson({hello: "world"});
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).then(({headers}) => {
		expect(headers["content-type"]).toBe("application/json");
	}).finally(() => {
		server.close();
	});
});
