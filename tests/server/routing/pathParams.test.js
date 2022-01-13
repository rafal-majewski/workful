const createServer = require("../../../createServer.js");
const axios = require("axios");
const {
	GET,
} = require("../../../utils/methodsSymbols.js");

test("GET /:test", (done) => {
	const server = createServer({
		":": ["test", {
			[GET]: (req, res) => {
				res.setStatusCode(200);
				res.end();
				expect(req.getPathParam("test")).toBe("abc");
				done();
			}
		}],
	});
	server.listen();
	axios.get(`http://localhost:${server.address().port}/abc`).finally(() => {
		server.close();
	});
});


test("GET /:test1/test2/:test3", (done) => {
	const server = createServer({
		":": ["test1", {
			"test2": {
				":": ["test3", {
					[GET]: (req, res) => {
						res.setStatusCode(200);
						res.end();
						expect(req.getPathParam("test1")).toBe("abc");
						expect(req.getPathParam("test3")).toBe("qwert");
						done();
					}
				}],
			},
		}],
	});
	server.listen();
	axios.get(`http://localhost:${server.address().port}/abc/test2/qwert`).finally(() => {
		server.close();
	});
});

test("GET /:test1/:test2", (done) => {
	const server = createServer({
		":": ["test1", {
			":": ["test2", {
				[GET]: (req, res) => {
					res.setStatusCode(200);
					res.end();
					expect(req.getPathParam("test1")).toBe("abc");
					expect(req.getPathParam("test2")).toBe("qwert");
					done();
				}
			}],
		}],
	});
	server.listen();
	axios.get(`http://localhost:${server.address().port}/abc/qwert`).finally(() => {
		server.close();
	});
});
