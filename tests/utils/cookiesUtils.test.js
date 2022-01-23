const cookiesUtils = require("../../utils/cookiesUtils.js");

test("headerify two cookies", () => {
	expect(cookiesUtils.headerify({
		"foo": {value: "bar", options: {}},
		"baz": {value: "qux", options: {}},
	})).toEqual(["foo=bar", "baz=qux"]);
});

test("headerify one cookie", () => {
	expect(cookiesUtils.headerify({
		"foo": {value: "bar", options: {}},
	})).toEqual(["foo=bar"]);
});

test("unheaderify two cookies", () => {
	expect(cookiesUtils.unheaderify(["foo=bar", "baz=qux"])).toEqual({
		"foo": {value: "bar", options: {}},
		"baz": {value: "qux", options: {}},
	});
});

test("unheaderify one cookie", () => {
	expect(cookiesUtils.unheaderify(["foo=bar"])).toEqual({
		"foo": {value: "bar", options: {}},
	});
});

test("unheaderify one cookie with semicolon", () => {
	expect(cookiesUtils.unheaderify(["foo=bar;"])).toEqual({
		"foo": {value: "bar", options: {}},
	});
});

test("headerify with max-age", () => {
	expect(cookiesUtils.headerify({
		"foo": {value: "bar", options: {["max-age"]: 1000}},
	})).toEqual(["foo=bar; max-age=1000"]);
});

test("headerify with secure", () => {
	expect(cookiesUtils.headerify({
		"foo": {value: "bar", options: {["secure"]: null}},
	})).toEqual(["foo=bar; secure"]);
});

test("unheaderify with secure", () => {
	expect(cookiesUtils.unheaderify(["foo=bar; secure"])).toEqual({
		"foo": {value: "bar", options: {["secure"]: null}},
	});
});