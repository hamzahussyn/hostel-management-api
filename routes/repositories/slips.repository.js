const { Op, literal } = require('sequelize');
const { SLIP_STATUS } = require('../../constants/slip');
const models = require('../../models');
require('dotenv').config();

const getSlipsListingRepository = (request) => {
  let whereParams = new Object();
  let likeParamsTenant = new Object();
  const PAGE = ((request.query.page || 1) - 1) * parseInt(process.env.PAGE_SIZE);

  if (request.query.column == 'name' || request.query.column == 'phone') {
    likeParamsTenant[request.query.column] = { [Op.like]: '%' + request.query.search + '%' }
  }

  if(request.query.type){
    if(request.query.type === SLIP_STATUS.PAID){
      whereParams[Op.and] = literal(`Slip.payment_status = 1`)
    }
    if(request.query.type === SLIP_STATUS.UNPAID){
      whereParams[Op.and] = literal(`Slip.payment_status = 0`)
    }
  }

  return models.Slip.findAndCountAll({
    where: {...whereParams},
    include: { model: models.Tenant, where: { ...likeParamsTenant }, attributes: ['id', 'name', 'phoneNumber'] },
    order: [['created_at', 'DESC']],
    offset: PAGE,
    limit: parseInt(process.env.PAGE_SIZE),
  })
}

module.exports = {
  getSlipsListingRepository
}