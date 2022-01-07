const stringifyQueryParams = require("../../utils/stringifyQueryParams.js");

test("stringify query param with null value", () => {
	expect(stringifyQueryParams({
		"foo": null
	})).toBe("foo");
});

test("stringify query param with empty value", () => {
	expect(stringifyQueryParams({
		"foo": ""
	})).toBe("foo=");
});

test("stringify query param with value", () => {
	expect(stringifyQueryParams({
		"foo": "bar"
	})).toBe("foo=bar");
});

test("stringify two query params", () => {
	expect(stringifyQueryParams({
		"foo": "bar",
		"baz": "qux"
	})).toBe("foo=bar&baz=qux");
});
