const models = require('../../models');
const { Op, where, fn, literal, col } = require('sequelize');
const { TENANT_STATUS } = require('../../constants/tenant');
require('dotenv').config();

const listingRepository = request => {
  let like = new Object();
  let whereParam = new Object();
  const PAGE = ((request.query.page || 1) - 1) * parseInt(process.env.PAGE_SIZE);

  if (request.query.column && request.query.search) {
    like[request.query.column] = { [Op.like]: '%' + request.query.search + '%' };
  }

  if (request.query.type) {
    if (request.query.type === TENANT_STATUS.RENT_DUE) {
      whereParam[Op.and] = where(col('last_rent_paid'), {
        [Op.or]: { [Op.eq]: 0, [Op.eq]: null },
      });
    }

    if (request.query.type === TENANT_STATUS.SLIP_DUE) {
      whereParam[Op.and] = where(fn('timestampdiff', literal('day'), col('last_rent_slip'), literal('CURRENT_TIMESTAMP')), {
        [Op.gte]: 30,
      });
    }
  }

  return models.Tenant.findAndCountAll({
    where: { ...like, ...whereParam },
    attributes: [
      'id',
      'name',
      'cnic',
      'fathers_name',
      'phone_number',
      'guardian_phone_number',
      'email',
      'residing',
      'last_rent_slip',
      'last_rent_paid',
      'meta'
    ],
    order: [['created_at', 'DESC']],
    offset: PAGE,
    limit: parseInt(process.env.PAGE_SIZE),
  });
};

module.exports = {
  listingRepository,
};
