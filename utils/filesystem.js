var fs = require('fs');
const { StatusCodes } = require('http-status-codes');
const { ErrorHandler } = require('../helpers/errorHandler');

var removeFile = function (filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    throw new ErrorHandler(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong.');
  }
};

var checkFile = function (filepath) {
  const fileExists = fs.existsSync(filepath);

  return fileExists;
};

var createFile = function (filepath, data, format) {
  let buffer = Buffer.from(data, "base64");

  fs.writeFileSync(filepath, data, format, err => {
    throw new ErrorHandler(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong');
  });
};

exports.removeFile = removeFile;
exports.checkFile = checkFile;
exports.createFile = createFile;
