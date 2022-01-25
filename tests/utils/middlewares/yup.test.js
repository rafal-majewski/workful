const createServer = require("../../../createServer.js");
const middlewares = require("../../../utils/middlewares.js");
const {
	GET,
	POST,
} = require("../../../utils/methodsSymbols.js");
const {
	YupValidationError,
} = require("../../../utils/errors.js");
const axios = require("axios");
const yup = require("yup");

test("queryParams correct", (done) => {
	const queryParamsSchema = yup.object().shape({
		"test": yup.number().required(),
	});

	const server = createServer([
		middlewares.yup.validateQueryParams(queryParamsSchema),
		{
			[POST]: (req, res, {yupQueryParams}) => {
				expect(yupQueryParams).toEqual({
					"test": 4,
				});
				done();
				res.setStatusCode(200).end();
			},
		},
	]);

	server.listen();
	axios.post(`http://localhost:${server.address().port}?test=4`).finally(() => {
		server.close();
	});
});

test("queryParams incorrect", async () => {
	const queryParamsSchema = yup.object().shape({
		"test": yup.number().required(),
	});

	const server = createServer([
		middlewares.yup.validateQueryParams(queryParamsSchema),
		{
			[POST]: (req, res) => {
				res.setStatusCode(200).end();
			},
		},
	]);

	server.listen();
	await axios.post(`http://localhost:${server.address().port}?test=abc`).catch((error) => {
		expect(error.response.status).toBe(400);
	}).finally(() => {
		server.close();
	});
});

test("queryParams if raises validation error", (done) => {
	const queryParamsSchema = yup.object().shape({
		"test": yup.number().required(),
	});

	const server = createServer([
		async (req, res, data, next) => {
			try {
				await next();
			} catch (error) {
				expect(error).toBeInstanceOf(YupValidationError);
				done();
				res.setStatusCode(500).end();
			}
		},
		middlewares.yup.validateQueryParams(queryParamsSchema),
		{
			[POST]: (req, res) => {
				res.setStatusCode(200).end();
			},
		},
	]);

	server.listen();
	axios.post(`http://localhost:${server.address().port}?test=abc`).catch(() => {}).finally(() => {
		server.close();
	});
});

test("other error", (done) => {
	const queryParamsSchema = yup.object().shape({
		"test": yup.number().required().test("test", "test", () => {
			throw new Error("test");
		}),
	});

	const server = createServer([
		async (req, res, data, next) => {
			try {
				await next();
			} catch (error) {
				expect(error).not.toBeInstanceOf(YupValidationError);
				done();
				res.setStatusCode(500).end();
			}
		},
		middlewares.yup.validateQueryParams(queryParamsSchema),
		{
			[GET]: (req, res) => {
				res.setStatusCode(200).end();
			},
		},
	]);

	server.listen();
	axios.get(`http://localhost:${server.address().port}?test=123`).catch(() => {}).finally(() => {
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

	test("other error if response 500", async () => {
		const queryParamsSchema = yup.object().shape({
			"test": yup.number().required().test("test", "test", () => {
				throw new Error("test");
			}),
		});

		const server = createServer([
			middlewares.yup.validateQueryParams(queryParamsSchema),
			{
				[GET]: (req, res) => {
					res.setStatusCode(200).end();
				},
			},
		]);

		server.listen();
		await axios.get(`http://localhost:${server.address().port}?test=123`).catch((error) => {
			expect(error.response.status).toBe(500);
		}).finally(() => {
			server.close();
		});
	});
});

test("jsonBody correct", (done) => {
	const jsonBodySchema = yup.object().shape({
		"test": yup.number().required(),
	});

	const server = createServer([
		middlewares.jsonBody,
		middlewares.yup.validateJsonBody(jsonBodySchema),
		{
			[POST]: (req, res, {yupJsonBody}) => {
				expect(yupJsonBody).toEqual({
					"test": 4,
				});
				done();
				res.setStatusCode(200).end();
			},
		},
	]);

	server.listen();
	axios.post(`http://localhost:${server.address().port}`, {
		"test": 4,
	}).finally(() => {
		server.close();
	});
});
