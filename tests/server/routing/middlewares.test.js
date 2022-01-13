const createServer = require("../../../createServer.js");
const axios = require("axios");

test("middleware with no next", async () => {
	const mock_callback = jest.fn((req, res) => {
		res.setStatusCode(200).end();
	});
	const server = createServer([
		() => {},
		mock_callback,
	]);
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		expect(mock_callback).toHaveBeenCalled();
		server.close();
	});
});

test("middleware with next, but not called, if timeouts", async () => {
	const server = createServer([
		// eslint-disable-next-line no-unused-vars
		(req, res, data, next) => {
			
		},
		(req, res) => {
			res.setStatusCode(200).end();
		},
	]);
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`, {
		timeout: 3000,
	}).catch((error) => {
		expect(error.code).toBe("ECONNABORTED");
	}).finally(() => {
		server.close();
	});
});


test("middleware with next, but not called, if final callback not called", async () => {
	const mock_callback = jest.fn((req, res) => {
		res.setStatusCode(200).end();
	});
	const server = createServer([
		// eslint-disable-next-line no-unused-vars
		(req, res, data, next) => {},
		mock_callback
	]);
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`, {
		timeout: 3000,
	}).catch(() => {}).finally(() => {
		server.close();
		expect(mock_callback).not.toHaveBeenCalled();
	});
});

class TestError extends Error {
	constructor(message) {
		super(message);
		this.name = "TestError";
	}
}

test("error handler middleware", (done) => {
	const server = createServer([
		async (req, res, data, next) => {
			try {
				await next();
			} catch (error) {
				expect(error).toBeInstanceOf(TestError);
				done();
				res.setStatusCode(500).end();
			}
		},
		() => {
			throw new TestError("test error");
		},
	]);
	server.listen();
	axios.get(`http://localhost:${server.address().port}`).catch(() => {}).finally(() => {
		server.close();
	});
});