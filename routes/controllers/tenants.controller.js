const { checkSchema } = require('express-validator');
const { formData, DocumentTypes } = require('../../utils/multer');
const { getTenantListingSchema, addNewTenantSchema, updateTenantSchema } = require('../dtos/tenants.dtos');
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
router.patch('/:id/update', [checkSchema(updateTenantSchema)],updateTenant);
router.delete('/:id/delete');
router.post(
  '/media-upload',
  [
    formData('images', DocumentTypes.IMAGES).fields([
      { name: 'tenant', maxCount: 1 },
      { name: 'nic', maxCount: 1 },
      { name: 'guardian_nic', maxCount: 1 },
    ]),
  ],
  uploadMedia,
);

module.exports = router;
