const stringifyCookies = require("../../utils/stringifyCookies.js");

test("stringify two cookies", () => {
	expect(stringifyCookies({
		"foo": "bar",
		"baz": "qux"
	})).toBe("foo=bar; baz=qux;");
});
