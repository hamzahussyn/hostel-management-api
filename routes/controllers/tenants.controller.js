const { checkSchema } = require('express-validator');
const { formData, DocumentTypes } = require('../../utils/multer');
const {
  getTenantListingSchema,
  addNewTenantSchema,
  updateTenantSchema,
  uploadMediaSchema,
  getByIdSchema,
  deleteByIdSchema,
  generateSlipSchema,
} = require('../dtos/tenants.dtos');
const {
  getTenantListing,
  addNewTenant,
  updateTenant,
  getTenantById,
  uploadMedia,
  deleteTenant,
  generateSlip,
} = require('../services/tenants.service');

const router = require('express').Router();

router.get('/', [checkSchema(getTenantListingSchema)], getTenantListing);
router.get('/:id', [checkSchema(getByIdSchema)], getTenantById);
router.post('/create', [checkSchema(addNewTenantSchema)], addNewTenant);
router.patch('/:id/update', [checkSchema(updateTenantSchema)], updateTenant);
router.delete('/:id/delete', [checkSchema(deleteByIdSchema)], deleteTenant);
router.post('/:id/generate-slip', [checkSchema(generateSlipSchema)], generateSlip);
router.post(
  '/:id/media-upload',
  [
    checkSchema(uploadMediaSchema),
    formData('images', DocumentTypes.IMAGES).fields([
      { name: 'tenant', maxCount: 1 },
      { name: 'nic', maxCount: 1 },
      { name: 'guardianCnic', maxCount: 1 },
      { name: 'formScan', maxCount: 1 }
    ]),
  ],
  uploadMedia,
);

module.exports = router;
