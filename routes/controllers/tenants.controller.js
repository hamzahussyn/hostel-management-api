const { checkSchema } = require('express-validator');
const { formData, DocumentTypes } = require('../../utils/multer');
const { getTenantListingSchema, addNewTenantSchema } = require('../dtos/tenants.dtos');
const {
  getTenantListing,
  addNewTenant,
  updateTenant,
  getTenantById,
  uploadMedia,
} = require('../services/tenants.service');

const router = require('express').Router();

router.get('/', [checkSchema(getTenantListingSchema)], getTenantListing);
router.get('/:id', getTenantById);
router.post('/create', [checkSchema(addNewTenantSchema)], addNewTenant);
router.patch('/update', updateTenant);
router.post(
  '/media',
  [
    formData('images', DocumentTypes.IMAGES).fields([
      { name: 'nic', maxCount: 1 },
      { name: 'second', maxCount: 1 },
    ]),
  ],
  uploadMedia,
);

module.exports = router;
