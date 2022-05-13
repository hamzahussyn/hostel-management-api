const getSlipsListingSchema = {
  column: {
    in: ['query'],
    optional: true
  },
  search: {
    in: ['query'],
    optional: true,
  },
  page: {
    in: ['query'],
    toInt: true,
    errorMessage: 'page is required in the query string.',
  },
};

const getSlipByIdSchema = {
  id: {
    in: ['params'],
    errorMessage: 'Id in params is required.',
    customSanitizer: {
      options: value => {
        let sanitizedValue;
        if (parseInt(value)) {
          sanitizedValue = parseInt(value);
        } else {
          sanitizedValue = 0;
        }
        return sanitizedValue;
      },
    },
  },
}

const deleteSlipByIdSchema = {
  id: {
    in: ['params'],
    errorMessage: 'Id in params is required.',
    customSanitizer: {
      options: value => {
        let sanitizedValue;
        if (parseInt(value)) {
          sanitizedValue = parseInt(value);
        } else {
          sanitizedValue = 0;
        }
        return sanitizedValue;
      },
    },
  },
}

const updatePaymentStatusSchema = {
  id: {
    in: ['params'],
    errorMessage: 'Id in params is required.',
    customSanitizer: {
      options: value => {
        let sanitizedValue;
        if (parseInt(value)) {
          sanitizedValue = parseInt(value);
        } else {
          sanitizedValue = 0;
        }
        return sanitizedValue;
      },
    },
  },
  paymentStatus: {
    in: ['body'],
    errorMessage: 'payment status is required',
    isBoolean: true
  }
}

module.exports = {
  getSlipsListingSchema,
  getSlipByIdSchema,
  deleteSlipByIdSchema,
  updatePaymentStatusSchema
}