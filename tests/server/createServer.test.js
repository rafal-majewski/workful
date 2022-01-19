const createServer = require("../../createServer.js");
const axios = require("axios");
const {
	GET,
} = require("../../utils/methodsSymbols.js");
const {
	InvalidResolverError,
} = require("../../utils/errors.js");

describe("quiet console.error", () => {
	const original_console_error = console.error;
	beforeEach(() => {
		console.error = () => {};
	});

	afterEach(() => {
		console.error = original_console_error;
	});

	test("createServer with function (error)", async () => {
		const server = createServer(() => {
			throw new Error("error");
		});
		server.listen();
		await axios.get(`http://localhost:${server.address().port}`).catch((error) => {
			expect(error.response.status).toBe(500);
		}).finally(() => {
			server.close();
		});
	});

});

test("createServer with no params", async () => {
	const server = createServer();
	server.listen();

	await axios.get(`http://localhost:${server.address().port}`).catch((error) => {
		expect(error.response.status).toBe(500);
	}).finally(() => {
		server.close();
	});
});

test("ending response without status code", async () => {
	const server = createServer((req, res) => {
		res.end();
	});
	server.listen();

	await axios.get(`http://localhost:${server.address().port}`).catch((error) => {
		expect(error.response.status).toBe(500);
	}).finally(() => {
		server.close();
	});
});


test("createServer with function (timeout)", async () => {
	const server = createServer(() => {});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`, {
		timeout: 3000,
	}).catch((error) => {
		expect(error.code).toBe("ECONNABORTED");
	}).finally(() => {
		server.close();
	});
});

test("createServer with function", async () => {
	const server = createServer((req, res) => {
		res.setStatusCode(200);
		res.end();
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});



test("createServer with a valid array of functions", async () => {
	const server = createServer([
		(req, res, data, next) => {
			res.setStatusCode(200);
			next();
		},
		(req, res) => {
			res.end();
		},
	]);
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).finally(() => {
		server.close();
	});
});

test("createServer with an array of functions without next", async () => {
	const server = createServer([
		(req, res) => {
			res.setStatusCode(200);
		},
		(req, res) => {
			res.end();
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

test("createServer with an array of functions without next, if the first was called", async () => {
	const mock_firstCallback = jest.fn((req, res) => {
		res.setStatusCode(200);
	});
	const server = createServer([
		mock_firstCallback,
		(req, res) => {
			res.end();
		},
	]);
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`, {
		timeout: 3000,
	}).catch(() => {
		expect(mock_firstCallback).toHaveBeenCalled();
	}).finally(() => {
		server.close();
	});
});


test("createServer with an array of functions without next, if the first was not called", async () => {
	const mock_secondCallback = jest.fn((req, res) => {
		res.end();
	});
	const server = createServer([
		(req, res) => {
			res.setStatusCode(200);
		},
		mock_secondCallback,
	]);
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`, {
		timeout: 3000,
	}).catch(() => {
		expect(mock_secondCallback).not.toHaveBeenCalled();
	}).finally(() => {
		server.close();
	});
});

test("createServer with an object", async () => {
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


test("createServer with an object, if resolving function called", async () => {
	const mock_getResolver = jest.fn((req, res) => {
		res.setStatusCode(200);
		res.end();
	});
	const server = createServer({
		[GET]: mock_getResolver
	});
	server.listen();
	await axios.get(`http://localhost:${server.address().port}`).then(() => {
		expect(mock_getResolver).toHaveBeenCalled();
	}).finally(() => {
		server.close();
	});
});

test("InvalidResolveError", (done) => {
	const server = createServer([
		async (req, res, data, next) => {
			try {
				await next();
			} catch (error) {
				if (error instanceof InvalidResolverError) {
					done();
				}
				throw error;
			}
		},
		3,
	]);
	server.listen();
	axios.get(`http://localhost:${server.address().port}`).catch(() => {}).finally(() => {
		server.close();
	});
});


test("InvalidResolveError (empty array)", (done) => {
	const server = createServer([
		async (req, res, data, next) => {
			try {
				await next();
			} catch (error) {
				if (error instanceof InvalidResolverError) {
					done();
				}
				throw error;
			}
		},
		[],
	]);
	server.listen();
	axios.get(`http://localhost:${server.address().port}`).catch(() => {}).finally(() => {
		server.close();
	});
});

describe("spy console error", () => {
	const original_console_error = console.error;
	let spy_console_error;
	beforeEach(() => {
		console.error = jest.fn();
	});
	afterEach(() => {
		console.error = original_console_error;
	});

	test("createServer with ending response and throwing error", async () => {
		const server = createServer([
			(req, res) => {
				res.setStatusCode(200);
				res.end();
				throw new Error("Error");
			},
		]);
		server.listen();
		await axios.get(`http://localhost:${server.address().port}`).catch(() => {
			expect(spy_console_error).toHaveBeenCalled();
		}).finally(() => {
			server.close();
		});
	});
	test("throwing error with invalid status code", async () => {
		const server = createServer(() => {
			const error = new Error("Error");
			error.httpStatusCode = 32343;
			throw error;
		});
		server.listen();
		await axios.get(`http://localhost:${server.address().port}`).catch((error) => {
			expect(error.response.status).toBe(500);
		}).finally(() => {
			server.close();
		});
	});
});
