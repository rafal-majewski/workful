const {
	YupValidationError,
} = require("../errors.js");

const getJsonBody = (req, res, data) => (data.jsonBody);
const setYupJsonBody = (workfulData, yupJsonBody) => (workfulData.yupJsonBody = yupJsonBody);

const getQueryParams = (req) => (req.getQueryParams());
const setYupQueryParams = (workfulData, yupQueryParams) => (workfulData.yupQueryParams = yupQueryParams);

const yupValidate = (getData, setData) => (schema) => async (req, res, workfulData) => {
	const data = await getData(req, res, workfulData);
	let yupData;
	try {
		yupData = await schema.validate(data, schema);
	} catch (error) {
		if (error.name === "ValidationError") throw new YupValidationError(error);
		throw error;
	}
	setData(workfulData, yupData);
};

module.exports = {
	json: yupValidate(getJsonBody, setYupJsonBody),
	query: yupValidate(getQueryParams, setYupQueryParams),
};
