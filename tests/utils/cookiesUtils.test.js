const cookiesUtils = require("../../utils/cookiesUtils.js");

test("headerify two cookies", () => {
	expect(cookiesUtils.headerify({
		"foo": "bar",
		"baz": "qux"
	})).toEqual(["foo=bar;", "baz=qux;"]);
});

test("headerify one cookie", () => {
	expect(cookiesUtils.headerify({
		"foo": "bar"
	})).toEqual(["foo=bar;"]);
});

test("unheaderify two cookies", () => {
	expect(cookiesUtils.unheaderify(["foo=bar;", "baz=qux;"])).toEqual({
		"foo": "bar",
		"baz": "qux"
	});
});

test("unheaderify one cookie", () => {
	expect(cookiesUtils.unheaderify(["foo=bar;"])).toEqual({
		"foo": "bar"
	});
});
