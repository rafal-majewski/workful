# workful
**DO NOT MEANT TO BE USED IN PRODUCTION ENVIRONMENT AS IT IS NOT FINISHED**
Simple node.js web framework

The framework works as an overlay to the standard http library createServer function,
simplifying the usage req and res objects.
Additionnaly, the framework significantly eases routes management.

# Installation
```
npm install workful
```

# Getting started
```javascript
const workful = require("workful");
const {
	GET,
	POST,
} = workful.symbols;

// to manage routes the framework uses an object, representing the routes tree

const router = {
	[GET]: (req, res) => {
		res.endText("Hello /");
		// res.endText automatically sets the content-type to text/plain
	},
	"users": {
		[GET]: (req, res) => {
			res.endJson([
				{
					"id": 1,
					"name": "John",
				},
				{
					"id": 2,
					"name": "Jane",
				},
			]);
			// res.endJson automatically sets the content-type to application/json
			// and stringifies the given object
		},
		[POST]: async (req, res) => {
			const body = (await req.getBody()).toString();
			// body isn't automatically fetched to improve performance
			// but once fetched, it's cached for the next usage of req.getBody()
			if (typeof body != "object" || typeof body.name != "string") {
				res.status(400).endText("Bad request");
				return;
			}
			const {name} = body;
			res.endJson({
				"id": 3,
				"name": name,
			});

		},
	},
};

const server = workful.createServer(router);
// workful.createServer returns a http server object
// requests are handled internally by the framework
server.listen(18281);
```