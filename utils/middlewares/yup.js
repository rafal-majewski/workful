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
		yupData = await schema.validate(data);
	} catch (error) {
		console.log(error);
		if (error.name === "ValidationError") throw new YupValidationError(error);
		throw error;
	}
	setData(workfulData, yupData);
};

module.exports = {
	validateJsonBody: yupValidate(getJsonBody, setYupJsonBody),
	validateQueryParams: yupValidate(getQueryParams, setYupQueryParams),
};
