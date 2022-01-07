const createServer = require("../../createServer.js");
const axios = require("axios");

test("if callback is called", (done) => {
	const mock_startCallback = jest.fn((req, res) => {
		done();
		res.end();
	});
	const server = createServer({}, {startCallback: mock_startCallback});
	server.listen();
	const port = server.address().port;
	axios.get(`http://localhost:${port}`).then(() => {
		expect(mock_startCallback).toHaveBeenCalled();
		server.close();
	});
});


test("if sets cors headers", async () => {
	const startCallback = (req, res) => {
		res.setHeader("access-control-allow-origin", "*");
		res.end();
	};
	const server = createServer({}, {startCallback});
	server.listen();
	const port = server.address().port;
	await axios.get(`http://localhost:${port}`).then((response) => {
		expect(response.headers["access-control-allow-origin"]).toBe("*");
		server.close();
	});
});
