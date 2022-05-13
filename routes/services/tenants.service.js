const { StatusCodes } = require('http-status-codes');
const models = require('../../models');
const fs = require('fs');
const { validatePayload, ErrorHandler } = require('../../helpers/errorHandler');
const { tenantlistingRepository, getTenantByIdRepository } = require('../repositories/tenant.repository');
const { convertToBase64, compressImage } = require('../../helpers/imageProcessing');
const { removeFile } = require('../../utils/filesystem');

const getTenantListing = async (request, response, next) => {
  try {
    validatePayload(request);

    let Tenants = await tenantlistingRepository(request);

    response.status(StatusCodes.OK).json({ data: Tenants, message: 'tenant listing', loading: false });
  } catch (error) {
    next(error);
  }
};

const getTenantById = async (request, response, next) => {
  try {
    validatePayload(request);

    if (request.params.id === 0) {
      throw new ErrorHandler(StatusCodes.BAD_REQUEST, 'Malformed id in params.');
    }

    let Tenant = await getTenantByIdRepository(request.params.id);

    response.status(StatusCodes.OK).json({ message: 'tenant by id', data: Tenant, loading: false });
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
      email: request.body?.email || null,
      guardianEmail: request.body?.guardianEmail || null,
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

const updateTenant = async (request, response, next) => {
  try {
    validatePayload(request);

    if (request.params.id === 0) {
      throw new ErrorHandler(StatusCodes.BAD_REQUEST, 'malformed id in params');
    }

    const Tenant = await models.Tenant.findByPk(request.params.id);
    if (!Tenant) {
      throw new ErrorHandler(StatusCodes.NOT_FOUND, 'The tenant requested for update does not exist');
    }

    const { body } = request;
    const updateBody = new Object();

    if (body.name) {
      updateBody.name = body.name;
    }

    if (body.cnic) {
      updateBody.cnic = body.cnic;
    }

    if (body.fathersName) {
      updateBody.fathersName = body.fathersName;
    }

    if (body.domicile) {
      updateBody.domicile = body.domicile;
    }

    if (body.phoneNumber) {
      updateBody.phoneNumber = body.phoneNumber;
    }

    if (body.guardianPhoneNumber) {
      updateBody.guardianPhoneNumber = body.guardianPhoneNumber;
    }

    if (body.email) {
      updateBody.email = body.email;
    }

    if (body.guardianEmail) {
      updateBody.guardianEmail = body.guardianEmail;
    }

    if (body.residing) {
      updateBody.residing = body.residing;
    }

    if (body.lastRentPaid) {
      updateBody.lastRentPaid = body.lastRentPaid;
    }

    if (body.meta) {
      updateBody.meta = body.meta;
    }

    await models.Tenant.update({ ...updateBody }, { where: { id: request.params.id } });
    response.status(StatusCodes.CREATED).json({ message: 'Tenant updated successfully', loading: false });
  } catch (error) {
    next(error);
  }
};

const uploadMedia = async (request, response, next) => {
  try {
    validatePayload(request);

    if (request.params.id === 0) {
      Object.keys(request.files).map(key => removeFile(request.files[key][0].path));

      throw new ErrorHandler(StatusCodes.BAD_REQUEST, 'Malformed id in params.');
    }

    let updateBody = new Object();

    if (request.files.tenant) {
      let { filename } = request.files.tenant[0];
      compressImage(filename);

      updateBody.tenantImage = convertToBase64(filename);
      updateBody.tenantImageFile = filename;
    }

    if (request.files.nic) {
      let { filename } = request.files.nic[0];
      compressImage(filename);

      updateBody.cnicImageFile = filename;
      updateBody.cnicImage = convertToBase64(filename);
    }

    if (request.files.guardianCnic) {
      let { filename } = request.files.guardianCnic[0];
      compressImage(filename);

      updateBody.guardianCnicImageFile = filename;
      updateBody.guardianCnicImage = convertToBase64(filename);
    }

    if (request.files.formScan) {
      let { filename } = request.files.formScan[0];
      compressImage(filename);

      updateBody.formScanImageFile = filename;
      updateBody.formScanImage = convertToBase64(filename);
    }

    await models.Tenant.update({ ...updateBody }, { where: { id: parseInt(request.params.id) } });
    response
      .status(StatusCodes.CREATED)
      .json({ message: 'The media files were uploaded successfully.', loading: false });
  } catch (error) {
    next(error);
  }
};

const deleteTenant = async (request, response, next) => {
  try {
    validatePayload(request);

    if (request.params.id === 0) {
      throw new ErrorHandler(StatusCodes.BAD_REQUEST, 'Malformed id in params');
    }

    let DeletedTenant = await models.Tenant.destroy({ where: { id: request.params.id } });

    response.status(StatusCodes.OK).json({ message: 'Tenant deleted successfully', loading: false });
  } catch (error) {
    next(error);
  }
};

const generateSlip = async (request, response, next) => {
  try {
    validatePayload(request);

    if (request.params.id === 0) {
      throw new ErrorHandler(StatusCodes.BAD_REQUEST, 'Malformed id in params.');
    }

    let Tenant = await models.Tenant.findByPk(request.params.id);

    if (!Tenant) {
      throw new ErrorHandler(StatusCodes.NOT_FOUND, 'Tenant does not exist');
    }

    // if (Tenant.lastRentSlip && !Tenant.lastRentPaid) {
    //   throw new ErrorHandler(StatusCodes.CONFLICT, 'Cannot generate new slip while old slip is due.');
    // }

    let GeneratedSlip = await models.Slip.create({
      tenantId: request.params.id,
      slipType: request.body.slipType,
      rentOfMonth: request.body.rentOfMonth,
      amount: request.body.amount,
      arrearsOrPenaltiesPaid: request.body.arrearsOrPenaltiesPaid,
      meta: request.body.meta,
    });

    await models.Tenant.update(
      {
        slipsCount: Tenant.slipsCount + 1,
        lastRentSlip: GeneratedSlip.createdAt,
        lastRentPaid: false,
      },
      { where: { id: request.params.id } },
    );

    response.status(StatusCodes.CREATED).json({
      data: {
        id: GeneratedSlip.id,
        tenantId: GeneratedSlip.tenantId,
        slipType: GeneratedSlip.slipType,
        rentOfMonth: GeneratedSlip.rentOfMonth,
        amount: GeneratedSlip.amount,
        arrearsOrPenaltiesPaid: GeneratedSlip.arrearsOrPenaltiesPaid,
        meta: GeneratedSlip.meta,
      },
      message: `generated slip for tenantid: ${request.params.id}`,
      loading: false,
    });
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
  deleteTenant,
  generateSlip,
};
