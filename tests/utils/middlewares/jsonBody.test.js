const createServer = require("../../../createServer.js");
const middlewares = require("../../../utils/middlewares.js");
const {
	GET,
	POST,
} = require("../../../utils/methodsSymbols.js");
const {
	NoBodyError,
	InvalidContentTypeError,
	InvalidJsonBodyError,
} = require("../../../utils/errors.js");
const axios = require("axios");

test("jsonBody", (done) => {
	const server = createServer([
		middlewares.jsonBody,
		{
			[POST]: (req, res, {jsonBody}) => {
				expect(jsonBody).toEqual({
					"test": 4,
				});
				done();
				res.setStatusCode(200).end();
			},
		},
	]);

	server.listen();
	axios.post(`http://localhost:${server.address().port}`, {"test": 4}).finally(() => {
		server.close();
	});
});

test("jsonBody with no body, if raises correct error", (done) => {
	const server = createServer([
		async (req, res, data, next) => {
			try {
				await next();
			} catch (err) {
				if (err instanceof NoBodyError) {
					done();
				}
				res.setStatusCode(500).end();
			}
		},
		middlewares.jsonBody,
		{
			[GET]: (req, res) => {
				res.setStatusCode(200).end();
			},
		},
	]);

	server.listen();
	axios.get(`http://localhost:${server.address().port}`).catch(() => {}).finally(() => {
		server.close();
	});
});

test("jsonBody with invalid content-type, if raises correct error", (done) => {
	const server = createServer([
		async (req, res, data, next) => {
			try {
				await next();
			} catch (err) {
				if (err instanceof InvalidContentTypeError) {
					done();
				}
				res.setStatusCode(500).end();
			}
		},
		middlewares.jsonBody,
		{
			[POST]: (req, res) => {
				res.setStatusCode(200).end();
			},
		},
	]);
	server.listen();
	axios.post(`http://localhost:${server.address().port}`, "{test: \"4\"}").catch(() => {}).finally(() => {
		server.close();
	});
});

test("incorrect json", (done) => {
	const server = createServer([
		async (req, res, data, next) => {
			try {
				await next();
			} catch (err) {
				if (err instanceof InvalidJsonBodyError) {
					done();
				}
				res.setStatusCode(500).end();
			}
		},
		middlewares.jsonBody,
		{
			[POST]: (req, res) => {
				res.setStatusCode(200).end();
			},
		},
	]);
	server.listen();
	axios.post(
		`http://localhost:${server.address().port}`,
		"test",
		{
			headers: {"content-type": "application/json"},
			transformRequest: [(data) => (data)],
		}
	).catch(() => {}).finally(() => {
		server.close();
	});
});

describe("quiet console.error", () => {
	const original_console_error = console.error;
	beforeEach(() => {
		console.error = () => {};
	});

	afterEach(() => {
		console.error = original_console_error;
	});

	test("jsonBody with no body response", (done) => {
		const server = createServer([
			middlewares.jsonBody,
			{
				[GET]: (req, res) => {
					res.setStatusCode(200).end();
				},
			},
		]);

		server.listen();
		axios.get(`http://localhost:${server.address().port}`).catch((error) => {
			expect(error.response.status).toBe(500);
			done();
		}).finally(() => {
			server.close();
		});
	});
});
