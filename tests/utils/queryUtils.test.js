const queryUtils = require("../../utils/queryUtils.js");

test("parse empty query", () => {
	expect(queryUtils.parse("")).toEqual({});
});

test("parse query with one param without value", () => {
	expect(queryUtils.parse("a")).toEqual({a: null});
});

test("parse query with one param with value", () => {
	expect(queryUtils.parse("a=b")).toEqual({a: "b"});
});

test("parse undefined query", () => {
	expect(queryUtils.parse(undefined)).toEqual(null);
});

test("parse null query", () => {
	expect(queryUtils.parse(null)).toEqual(null);
});

test("parse query with multiple params", () => {
	expect(queryUtils.parse("a=b&c=d")).toEqual({a: "b", c: "d"});
});

test("stringify query param with null value", () => {
	expect(queryUtils.stringify({
		"foo": null
	})).toBe("foo");
});

test("stringify query param with empty value", () => {
	expect(queryUtils.stringify({
		"foo": ""
	})).toBe("foo=");
});

test("stringify query param with value", () => {
	expect(queryUtils.stringify({
		"foo": "bar"
	})).toBe("foo=bar");
});

test("stringify two query params", () => {
	expect(queryUtils.stringify({
		"foo": "bar",
		"baz": "qux"
	})).toBe("foo=bar&baz=qux");
});

test("stringify query params with numeric values", () => {
	expect(queryUtils.stringify({
		"foo": 1,
		"baz": 2
	})).toBe("foo=1&baz=2");
});
