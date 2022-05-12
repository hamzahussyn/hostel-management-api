const { Op } = require('sequelize');
const models = require('../../models');
require('dotenv').config();

const getSlipsListingRepository = (request) => {
  let likeParamsTenant = new Object();
  const PAGE = ((request.query.page || 1) - 1) * parseInt(process.env.PAGE_SIZE);

  if (request.query.column == 'name' || request.query.column == 'phone') {
    likeParamsTenant[request.query.column] = { [Op.like]: '%' + request.query.search + '%' }
  }

  return models.Slip.findAndCountAll({
    include: { model: models.Tenant, where: { ...likeParamsTenant }, attributes: ['id', 'name', 'phoneNumber'] },
    order: [['created_at', 'DESC']],
    offset: PAGE,
    limit: parseInt(process.env.PAGE_SIZE),
  })
}

module.exports = {
  getSlipsListingRepository
}