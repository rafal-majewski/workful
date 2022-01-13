const createServer = require("../../../createServer.js");
const axios = require("axios");
const {
	GET,
} = require("../../../utils/methodsSymbols.js");
const {
	MethodNotAllowedError
} = require("../../../utils/errors.js");

test("GET /", async () => {
	const server = createServer({
		[GET]: (req, res) => {
			res.setStatusCode(200);
			res.end();
		},
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});

test("GET / with data unchanged", (done) => {
	const server = createServer([
		(req, res, data, next) => {
			next();
		},
		(req, res, data) => {
			expect(data).toEqual({});
			res.setStatusCode(200);
			res.end();
			done();
		}
	]);
	server.listen();
	axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});

test("GET / with setting data", (done) => {
	const server = createServer([
		(req, res, data, next) => {
			data.test = "abc";
			next();
		},
		(req, res, data) => {
			expect(data.test).toBe("abc");
			res.setStatusCode(200);
			res.end();
			done();
		}
	]);
	server.listen();
	axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});

test("MethodNotAllowedError", (done) => {
	const server = createServer([
		async (req, res, data, next) => {
			try {
				await next();
			} catch (err) {
				if (err instanceof MethodNotAllowedError) {
					done();
				}
				res.setStatusCode(500).end();
			}
		},
		{
			[GET]: (req, res) => {
				res.setStatusCode(200).end();
			},
		},
	]);
	server.listen();
	axios.post(`http://localhost:${server.address().port}`, {}).catch(() => {}).finally(() => {
		server.close();
	});
});

test("not found but with subroutes", async () => {
	const server = createServer({
		"test": {
			"abc": {
				[GET]: (req, res) => {
					res.setStatusCode(200).end();
				}
			},
		},
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}/test`).catch((error) => {
		expect(error.response.status).toBe(404);
	}).finally(() => {
		server.close();
	});
});

test("method not allowed", async () => {
	const server = createServer({
		[GET]: (req, res) => {
			res.setStatusCode(200).end();
		},
	});
	server.listen();
	await axios.post(`http://localhost:${server.address().port}`).catch((error) => {
		expect(error.response.status).toBe(405);
	}).finally(() => {
		server.close();
	});
});

test("not found", async () => {
	const server = createServer({
		[GET]: (req, res) => {
			res.setStatusCode(200).end();
		},
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}/test`).catch((error) => {
		expect(error.response.status).toBe(404);
	}).finally(() => {
		server.close();
	});
});

test("multiple path params", (done) => {
	const server = createServer({
		":": ["test", {
			"sr": {
				":": ["abc", {
					[GET]: (req, res) => {
						expect(req.getPathParams()).toEqual({
							test: "test",
							abc: "def",
						});
						done();
						res.setStatusCode(200).end();
					}
				}]
			},
		}],
	});
	server.listen();
	axios.get(`http://localhost:${server.address().port}/test/sr/def`).catch(() => {}).finally(() => {
		server.close();
	});
});
