const { StatusCodes } = require('http-status-codes');
const { validatePayload, ErrorHandler } = require('../../helpers/errorHandler');
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
};

const getSlipById = async (req, res, next) => {
  try {
    validatePayload(req);

    if (req.params.id == 0) {
      throw new ErrorHandler(StatusCodes.BAD_REQUEST, 'Malformed id in params.');
    }

    let Slip = await models.Slip.findOne({
      where: { id: req.params.id },
      raw: true,
      include: { model: models.Tenant, attributes: ['id', 'name', 'phoneNumber'] },
    });

    res.status(StatusCodes.OK).json({ data: Slip, message: 'Slip by id', loading: false });
  } catch (error) {
    next(error);
  }
};

const deleteSlip = async (req, res, next) => {
  try {
    validatePayload(req);

    if (req.params.id == 0) {
      throw new ErrorHandler(StatusCodes.BAD_REQUEST, 'Malformed id in params.');
    }

    await models.Slip.destroy({ where: { id: req.params.id } });
    res.status(StatusCodes.CREATED).json({ message: 'Slip deleted successfully.', loading: false });
  } catch (error) {
    next(error);
  }
};

const updatePaymentStatus = async (req, res, next) => {
  try {
    validatePayload(req);

    if (req.params.id == 0) {
      throw new ErrorHandler(StatusCodes.BAD_REQUEST, 'Malformed id in params.');
    }

    await models.Slip.update({ paymentStatus: req.body.paymentStatus }, { where: { id: req.params.id } });
    res.status(StatusCodes.CREATED).json({ message: 'Payment status updated successfully', loading: false });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSlipsListing,
  getSlipById,
  deleteSlip,
  updatePaymentStatus,
};
