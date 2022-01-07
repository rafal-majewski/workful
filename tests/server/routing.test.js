const createServer = require("../../createServer.js");
const {
	GET,
	ANY_SUBROUTE,
	PATH_PARAM_NAME,
	SUBROUTE_NOT_FOUND,
	MIDDLEWARE,
} = require("../../utils/symbols.js");
const axios = require("axios");

test("main route", async () => {
	const mockCallback = jest.fn((req, res) => {
		res.setStatusCode(200).end();
	});

	const server = createServer({
		[GET]: mockCallback,
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).then(() => {
		expect(mockCallback).toHaveBeenCalled();
	}).finally(() => {
		server.close();
	});
});

test("1 sub route", async () => {
	const mockCallback = jest.fn((req, res) => {
		res.setStatusCode(200).end();
	});

	const server = createServer({
		"tests": {
			[GET]: mockCallback,
		},
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}/tests`).then(() => {
		expect(mockCallback).toHaveBeenCalled();
	}).finally(() => {
		server.close();
	});
});

test("2 sub routes", async () => {
	const mockCallback = jest.fn((req, res) => {
		res.setStatusCode(200).end();
	});

	const server = createServer({
		"tests1": {
			"tests2": {
				[GET]: mockCallback,
			},
		},
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}/tests1/tests2`).then(() => {
		expect(mockCallback).toHaveBeenCalled();
	}).finally(() => {
		server.close();
	});
});

test("no sub route", async () => {
	const server = createServer({});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}/tests3`).catch((error) => {
		expect(error.response.status).toBe(404);
	}).finally(() => {
		server.close();
	});
});

test("wrong method", async () => {
	const server = createServer({
		[GET]: () => {},
	});
	server.listen();
	await axios.post(`http://localhost:${server.address().port}`).catch((error) => {
		expect(error.response.status).toBe(405);
	}).finally(() => {
		server.close();
	});
});

describe("mock console.error", () => {
	const oldConsoleError = console.error;
	beforeEach(() => {
		console.error = jest.fn();
	});
	afterEach(() => {
		console.error = oldConsoleError;
	});


	test("error default callback", async () => {
		const server = createServer({
			[GET]: () => {
				throw new Error("test");
			},
		});
		server.listen();
		console.error = jest.fn()
		await axios.get(`http://localhost:${server.address().port}`).catch(() => {
			expect(console.error).toHaveBeenCalled();
		}).finally(() => {
			server.close();
		});
	});
});

test("any sub route", async () => {
	const mockCallback = jest.fn((req, res) => {
		res.setStatusCode(200).end();
	});

	const server = createServer({
		[ANY_SUBROUTE]: {
			[GET]: mockCallback,
		},
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}/tests`).then(() => {
		expect(mockCallback).toHaveBeenCalled();
	}).finally(() => {
		server.close();
	});
});

test("any sub route with path param", async () => {
	const server = createServer({
		[ANY_SUBROUTE]: {
			[PATH_PARAM_NAME]: "test",
			[GET]: (req, res) => {
				expect(req.getPathParam("test")).toBe("123");
				res.end();
			},
		},
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}/123`).finally(() => {
		server.close();
	});
});

test("SUBROUTE_NOT_FOUND with a custom request-ending callback", async () => {
	const mockCallback = jest.fn((req, res) => {
		res.setStatusCode(404).end();
	});

	const server = createServer({
		[SUBROUTE_NOT_FOUND]: mockCallback,
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}/tests`).catch(() => {
		expect(mockCallback).toHaveBeenCalled();
	}).finally(() => {
		server.close();
	});
});

test("SUBROUTE_NOT_FOUND with a custom non-request-ending callback", async () => {
	const mockCallback = jest.fn((req, res) => {
		res.setStatusCode(404);
	});

	const server = createServer({
		[SUBROUTE_NOT_FOUND]: mockCallback,
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}/tests`).catch(() => {
		expect(mockCallback).toHaveBeenCalled();
	}).finally(() => {
		server.close();
	});
});

test("root route non-request-ending middleware", async () => {
	const mockCallback = jest.fn(() => {});

	const server = createServer({
		[MIDDLEWARE]: mockCallback,
		[GET]: (req, res) => {
			res.setStatusCode(200).end();
		},
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).then(() => {
		expect(mockCallback).toHaveBeenCalled();
	}).finally(() => {
		server.close();
	});
});

test("root route request-ending middleware", async () => {
	const mockCallback = jest.fn((req, res) => {
		res.setStatusCode(200).end();
	});

	const server = createServer({
		[MIDDLEWARE]: mockCallback,
		[GET]: () => {},
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).then(() => {
		expect(mockCallback).toHaveBeenCalled();
	}).finally(() => {
		server.close();
	});
});

test("sub route non-request-ending middleware", async () => {
	const mockCallback = jest.fn(() => {});

	const server = createServer({
		"tests": {
			[MIDDLEWARE]: mockCallback,
			[GET]: (req, res) => {
				res.setStatusCode(200).end();
			},
		},
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}/tests`).then(() => {
		expect(mockCallback).toHaveBeenCalled();
	}).finally(() => {
		server.close();
	});
});

test("sub route request-ending middleware", async () => {
	const mockCallback = jest.fn((req, res) => {
		res.setStatusCode(200).end();
	});

	const server = createServer({
		"tests": {
			[MIDDLEWARE]: mockCallback,
			[GET]: () => {},
		},
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}/tests`).then(() => {
		expect(mockCallback).toHaveBeenCalled();
	}).finally(() => {
		server.close();
	});
});