const models = require('./models');

// models.Slip.create({
//   tenantId: 2,
//   slipType: 'Rent',
//   rentOfMonth: 'January',
//   amount: 25000
// }).then((res) => console.log('record created'));

//models.Tenant.findOne({where: {id: 2}, include:[{model: models.Slip}], raw: true, nest: true}).then((res => console.log(res)));

models.Slip.findOne({where: {id: 4}, include:[{model: models.Tenant}], raw: true, nest: true}).then(res => console.log(res));