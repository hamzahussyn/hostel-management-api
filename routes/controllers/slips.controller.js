const { checkSchema } = require('express-validator');
const { getSlipsListingSchema } = require('../dtos/slips.dto');
const { getSlipsListing, getSlipById, deleteSlip } = require('../services/slips.service');

const router = require('express').Router();

router.get('/', [checkSchema(getSlipsListingSchema)],getSlipsListing);
router.get('/:id', getSlipById);
router.delete('/:id', deleteSlip);

module.exports = router;