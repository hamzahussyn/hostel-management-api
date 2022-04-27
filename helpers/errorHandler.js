const {validationResult} = require('express-validator');
const StatusCodes = require('http-status-codes');

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, res) => {
  let { statusCode } = err;
  const { message } = err;
  if (!statusCode) {
    statusCode = 500;
  }
  res.status(statusCode).json({
    errors: [
      {
        status: statusCode,
        title: message,
      },
    ],
  });
};

const validatePayload = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ErrorHandler(
      400,
      errors['errors'][0].msg
    );
  }
}

module.exports = {
  ErrorHandler,
  handleError,
  validatePayload
};
