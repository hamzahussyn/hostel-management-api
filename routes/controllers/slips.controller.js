const { checkSchema, body } = require('express-validator');
const { getSlipsListingSchema, getSlipByIdSchema, deleteSlipByIdSchema, updatePaymentStatusSchema } = require('../dtos/slips.dto');
const { getSlipsListing, getSlipById, deleteSlip, updatePaymentStatus } = require('../services/slips.service');

const router = require('express').Router();

router.get('/', [checkSchema(getSlipsListingSchema)], getSlipsListing);
router.get('/:id', [checkSchema(getSlipByIdSchema)], getSlipById);
router.delete('/:id', [checkSchema(deleteSlipByIdSchema)], deleteSlip);
router.post('/:id/payment', [checkSchema(updatePaymentStatusSchema)], updatePaymentStatus)

module.exports = router;