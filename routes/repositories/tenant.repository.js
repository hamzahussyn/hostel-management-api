const models = require('../../models');
const { Op, where, fn, literal, col } = require('sequelize');
const { TENANT_STATUS } = require('../../constants/tenant');
const { checkFile, createFile } = require('../../utils/filesystem');
require('dotenv').config();

const _selectTenantsOnSlipPaymentStatus = paymentStatus => {
  return `
    SELECT 
      slips.tenant_id
    FROM 
      slips, tenants
    WHERE 
      slips.tenant_id = tenants.id 
        AND
      slips.payment_status = ${paymentStatus}
        AND
      slips.deleted_at IS NULL
  `;
};

const _selectCountOfSlipsOnPaymentStatus = () => {
  return `
    SELECT 
      COUNT(*) 
    FROM 
      slips AS Slip
    WHERE 
      Slip.tenant_id = Tenant.id 
        AND 
      Slip.payment_status = FALSE
        AND
      Slip.deleted_at IS NULL
  `;
};

const tenantlistingRepository = request => {
  let like = new Object();
  let whereParam = new Object();
  const PAGE = ((request.query.page || 1) - 1) * parseInt(process.env.PAGE_SIZE);

  if (request.query.column && request.query.search) {
    like[request.query.column] = { [Op.like]: '%' + request.query.search + '%' };
  }

  if (request.query.type) {
    if (request.query.type === TENANT_STATUS.RENT_DUE) {
      whereParam[Op.and] = literal(`
        id IN
          (
            ${_selectTenantsOnSlipPaymentStatus(false)}
          ) 
      `);
    }

    if (request.query.type === TENANT_STATUS.PAID) {
      whereParam[Op.and] = literal(`
        id IN
          (
            ${_selectTenantsOnSlipPaymentStatus(true)}
            EXCEPT
            ${_selectTenantsOnSlipPaymentStatus(false)}
          ) 
      `);
    }

    if (request.query.type === TENANT_STATUS.SLIP_DUE) {
      whereParam[Op.and] = where(
        fn('timestampdiff', literal('day'), col('last_rent_slip'), literal('CURRENT_TIMESTAMP')),
        {
          [Op.gte]: 30,
        },
      );
    }
  }

  return models.Tenant.findAndCountAll({
    where: { ...like, ...whereParam },
    attributes: {
      include: [[literal(`(${_selectCountOfSlipsOnPaymentStatus()}) = 0`), 'paymentStatus']],
      exclude: ['formScanImage', 'cnicImage', 'tenantImage', 'guardianCnicImage'],
    },
    order: [['created_at', 'DESC']],
    offset: PAGE,
    limit: parseInt(process.env.PAGE_SIZE),
  });
};

const getTenantByIdRepository = tenantid => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        let Tenant = await models.Tenant.findOne({
          where: { id: tenantid },
          attributes: [
            'id',
            'name',
            'cnic',
            'domicile',
            'fathersName',
            'phoneNumber',
            'guardianPhoneNumber',
            'email',
            'guardianEmail',
            'residing',
            'lastRentSlip',
            'lastRentPaid',
            'slipsCount',
            'tenantImageFile',
            'cnicImageFile',
            'guardianCnicImageFile',
            'tenantImage',
            'cnicImage',
            'guardianCnicImage',
            'formScanImageFile',
            'formScanImage',
            'createdAt',
            'updatedAt',
            'meta',
          ],
          raw: true,
          nest: true,
        });

        if (Tenant.tenantImageFile) {
          let tenantImagePath = `./media/images/${Tenant?.tenantImageFile}`;
          if (!checkFile(tenantImagePath)) {
            createFile(tenantImagePath, String(Tenant.tenantImage), 'base64');
          }
        }

        if (Tenant.cnicImageFile) {
          let cnicImagePath = `./media/images/${Tenant.cnicImageFile}`;
          if (!checkFile(cnicImagePath)) {
            createFile(cnicImagePath, String(Tenant.cnicImage), 'base64');
          }
        }

        if (Tenant.guardianCnicFile) {
          let guardianCnicPath = `./media/images/${Tenant.guardianCnicFile}`;
          if (!checkFile(guardianCnicPath)) {
            createFile(guardianCnicPath, String(Tenant.guardianCnicImage), 'base64');
          }
        }

        if (Tenant.formScanFile) {
          let formScanPath = `./media/images/${Tenant.formScanFile}`;
          if (!checkFile(formScanPath)) {
            createFile(formScanPath, String(Tenant.formScanImage), 'base64');
          }
        }

        let Slip = await models.Slip.findOne({
          where: { tenantId: tenantid },
          order: [['createdAt', 'DESC']],
          limit: 1,
          raw: true,
        });

        let TenantToReturn = { ...Tenant };
        TenantToReturn.Slip = Slip;

        delete TenantToReturn.tenantImage;
        delete TenantToReturn.cnicImage;
        delete TenantToReturn.guardianCnicImage;
        delete TenantToReturn.formScanImage;

        resolve(TenantToReturn);
        return TenantToReturn;
      } catch (error) {
        reject(error);
      }
    })();
  });
};

module.exports = {
  tenantlistingRepository,
  getTenantByIdRepository,
};
