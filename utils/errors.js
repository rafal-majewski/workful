class InvalidContentTypeError extends Error {
	constructor(message) {
		super(message);
		this.name = "InvalidContentTypeError";
		this.httpStatusCode = 415;
	}
}

class NoBodyError extends Error {
	constructor(message) {
		super(message);
		this.name = "NoBodyError";
		this.httpStatusCode = 500;
	}
}

class InvalidBodyError extends Error {
	constructor(message) {
		super(message);
		this.name = "InvalidBodyError";
		this.httpStatusCode = 400;
	}
}

class InvalidJsonBodyError extends InvalidBodyError {
	constructor(message) {
		super(message);
		this.name = "InvalidJsonBodyError";
	}
}

class MethodNotAllowedError extends Error {
	constructor(message) {
		super(message);
		this.name = "MethodNotAllowed";
		this.httpStatusCode = 405;
	}
}

class NotFoundError extends Error {
	constructor(message) {
		super(message);
		this.name = "NotFound";
		this.httpStatusCode = 404;
	}
}

class InvalidResolverError extends Error {
	constructor(message) {
		super(message);
		this.name = "InvalidResolverError";
		this.httpStatusCode = 500;
	}
}

class YupValidationError extends Error {
	constructor(yupError) {
		super(yupError.message);
		this.yupError = yupError;
		this.name = "YupValidationError";
		this.httpStatusCode = 400;
	}
}

class InternalError extends Error {
	constructor(message) {
		super(message);
		this.name = "InternalError";
		this.httpStatusCode = 500;
	}
}


module.exports = {
	InvalidContentTypeError,
	InvalidBodyError,
	InvalidJsonBodyError,
	MethodNotAllowedError,
	NotFoundError,
	InvalidResolverError,
	NoBodyError,
	YupValidationError,
	InternalError,
};
