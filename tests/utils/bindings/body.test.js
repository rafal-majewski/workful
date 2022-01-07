const bindings = require("../../../utils/bindings.js");
const {createServer} = require("http");
const axios = require("axios");

test("return value", (done) => {
	const server = createServer((req, res) => {
		bindings.body(req);
		req.getBody().then((body) => {
			expect(body).toEqual(Buffer.from("abc"));
			done();
		});
		res.statusCode = 200;
		res.end();
	});
	server.listen();
	axios.post(`http://localhost:${server.address().port}`, "abc").finally(() => {
		server.close();
	});
});
