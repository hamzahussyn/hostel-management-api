const { StatusCodes } = require('http-status-codes');
const { validatePayload } = require('../../helpers/errorHandler');
const models = require('../../models');
const { getSlipsListingRepository } = require('../repositories/slips.repository');

const getSlipsListing = async (req, res, next) => {
  try {
    validatePayload(req);

    let SlipsListing = await getSlipsListingRepository(req);

    res.status(StatusCodes.OK).json({ message: 'slips listing', data: SlipsListing, loading: false });
  } catch (error) {
    next(error);
  }
}

const getSlipById = (req, res, next) => {
  try {

  } catch (error) {

  }
}

const deleteSlip = (req, res, next) => {
  try {

  } catch (error) {

  }
}

module.exports = {
  getSlipsListing,
  getSlipById,
  deleteSlip
}