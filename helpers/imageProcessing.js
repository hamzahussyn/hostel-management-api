const { StatusCodes } = require('http-status-codes');
const compressor = require('jimp');
const fs = require('fs');
const { ErrorHandler } = require('./errorHandler');

function convertToBase64(filename){
  const base64 = fs.readFileSync(`./media/images/${filename}`, "base64");
  return base64;
}

function compressImage(filename) {
  let base64 = convertToBase64(filename);
  let buffer = Buffer.from(base64, "base64");

  compressor.read(buffer, function (err, res) {
    if (err) throw new ErrorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong");
    res.quality(40).write(`./media/images/${filename}`);
  })
}

module.exports = {
  convertToBase64,
  compressImage
}