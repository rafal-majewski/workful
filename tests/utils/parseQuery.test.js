const parseQuery = require("../../utils/parseQuery.js");

test("parse empty query", () => {
	expect(parseQuery("")).toEqual({});
});

test("parse query with one param without value", () => {
	expect(parseQuery("a")).toEqual({a: null});
});

test("parse query with one param with value", () => {
	expect(parseQuery("a=b")).toEqual({a: "b"});
});

test("parse undefined query", () => {
	expect(parseQuery(undefined)).toEqual(null);
});

test("parse null query", () => {
	expect(parseQuery(null)).toEqual(null);
});
