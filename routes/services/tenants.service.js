const { StatusCodes } = require('http-status-codes');
const models = require('../../models');
const { validatePayload, ErrorHandler } = require('../../helpers/errorHandler');
const { listingRepository } = require('../repositories/tenant.repository');

const getTenantListing = async (request, response, next) => {
  try {
    validatePayload(request);

    let Tenants = await listingRepository(request);

    response.status(StatusCodes.OK).json({ data: Tenants, message: 'tenant listing', loading: false });
  } catch (error) {
    next(error);
  }
};

const getTenantById = (request, response, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const addNewTenant = async (request, response, next) => {
  try {
    validatePayload(request);

    const Tenant = await models.Tenant.findOne({
      where: { phoneNumber: request.body.phoneNumber },
    });
    if (Tenant) {
      throw new ErrorHandler(StatusCodes.CONFLICT, 'User with this number already exists');
    }

    const NewTenant = await models.Tenant.create({
      name: request.body.name,
      cnic: request.body.cnic,
      fathersName: request.body.fathersName,
      domicile: request.body.domicile,
      phoneNumber: request.body.phoneNumber,
      guardianPhoneNumber: request.body.guardianPhoneNumber,
      email: request.body.email,
      guardianEmail: request.body.guardianEmail,
      meta: request.body.meta,
      residing: true,
    });

    response.status(StatusCodes.CREATED).json({
      type: 'Tenant',
      data: {
        id: NewTenant.id,
        attributes: {
          name: NewTenant.name,
          cnic: NewTenant.cnic,
          fathersName: NewTenant.fathersName,
          domicile: NewTenant.domicile,
          phoneNumber: NewTenant.phoneNumber,
          guardianPhoneNumber: NewTenant.guardianPhoneNumber,
          email: NewTenant.email,
          guardianEmail: NewTenant.guardianEmail,
          residing: NewTenant.residing,
          meta: NewTenant.meta,
        },
      },
      message: 'New Tenant Created.',
      loading: false,
    });
  } catch (error) {
    next(error);
  }
};

const updateTenant = (request, response, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const uploadMedia = (request, response, next) => {
  try {
    console.log(request.files);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTenantListing,
  getTenantById,
  addNewTenant,
  updateTenant,
  uploadMedia,
};
