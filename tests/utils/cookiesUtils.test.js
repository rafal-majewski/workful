const cookiesUtils = require("../../utils/cookiesUtils.js");

test("headerify two cookies", () => {
	expect(cookiesUtils.headerify({
		"foo": {name: "foo", value: "bar", options: {}},
		"baz": {name: "baz", value: "qux", options: {}},
	})).toEqual(["foo=bar", "baz=qux"]);
});

test("headerify one cookie", () => {
	expect(cookiesUtils.headerify({
		"foo": {name: "foo", value: "bar", options: {}},
	})).toEqual(["foo=bar"]);
});

test("req unheaderify two cookies", () => {
	expect(cookiesUtils.unheaderify(["foo=bar", "baz=qux"])).toEqual({
		"foo": {name: "foo", value: "bar", options: {}},
		"baz": {name: "baz", value: "qux", options: {}},
	});
});

test("unheaderify one cookie", () => {
	expect(cookiesUtils.unheaderify(["foo=bar"])).toEqual({
		"foo": {name: "foo", value: "bar", options: {}},
	});
});

test("res headerify with max-age", () => {
	expect(cookiesUtils.headerify({
		"foo": {name: "foo", value: "bar", options: {["max-age"]: 1000}},
	})).toEqual(["foo=bar; max-age=1000"]);
});

test("headerify with secure", () => {
	expect(cookiesUtils.headerify({
		"foo": {name: "foo", value: "bar", options: {["secure"]: true}},
	})).toEqual(["foo=bar; secure"]);
});

test("unheaderify with secure", () => {
	expect(cookiesUtils.unheaderify(["foo=bar; secure"])).toEqual({
		"foo": {name: "foo", value: "bar", options: {["secure"]: true}},
	});
});
