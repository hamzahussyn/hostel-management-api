const getTenantListingSchema = {
  column: {
    in: ['query'],
    optional: true,
  },
  search: {
    in: ['query'],
    optional: true,
  },
  type: {
    in: ['query'],
    optional: true,
  },
  page: {
    in: ['query'],
    toInt: true,
    errorMessage: 'page is required in the query string.',
  },
};

const addNewTenantSchema = {
  name: {
    in: ['body'],
    isString: true,
    errorMessage: 'Name is a required Field',
  },
  cnic: {
    in: ['body'],
    isString: true,
    errorMessage: 'cnic is a required Field',
  },
  fathersName: {
    in: ['body'],
    isString: true,
    errorMessage: 'fathersName is a required Field',
  },
  domicile: {
    in: ['body'],
    isString: true,
    errorMessage: 'domicile is a required Field',
  },
  phoneNumber: {
    in: ['body'],
    isString: true,
    errorMessage: 'phoneNumber is a required Field',
  },
  guardianPhoneNumber: {
    in: ['body'],
    isString: true,
    errorMessage: 'guardianPhoneNumber is a required Field',
  },
  email: {
    in: ['body'],
    isString: true,
    isEmail: true,
    errorMessage: 'email is a required Field',
    optional: true,
  },
  guardianEmail: {
    in: ['body'],
    isString: true,
    isEmail: true,
    errorMessage: 'guardianEmail is a required Field',
    optional: true,
  },
  meta: {
    in: ['body'],
    isString: true,
    errorMessage: 'meta is a required Field',
  },
};

const updateTenantSchema = {
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
  name: {
    in: ['body'],
    isString: true,
    optional: true,
  },
  cnic: {
    in: ['body'],
    isString: true,
    optional: true,
  },
  fathersName: {
    in: ['body'],
    isString: true,
    optional: true,
  },
  domicile: {
    in: ['body'],
    isString: true,
    optional: true,
  },
  phoneNumber: {
    in: ['body'],
    isString: true,
    optional: true,
  },
  guardianPhoneNumber: {
    in: ['body'],
    isString: true,
    optional: true,
  },
  email: {
    in: ['body'],
    isString: true,
    isEmail: true,
    optional: true,
  },
  guardianEmail: {
    in: ['body'],
    isString: true,
    isEmail: true,
    optional: true,
  },
  meta: {
    in: ['body'],
    isString: true,
    optional: true,
  },
  residing: {
    in: ['body'],
    isBoolean: true,
    optional: true,
  },
};

const uploadMediaSchema = {
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
};

const getByIdSchema = {
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
};

const deleteByIdSchema = {
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
};

const generateSlipSchema = {
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
  slipType: {
    in: ['body'],
    isString: true,
    errorMessage: 'slip type is required',
  },
  rentOfMonth: {
    in: ['body'],
    isString: true,
    errorMessage: 'rent of the month is required',
  },
  amount: {
    in: ['body'],
    isInt: true,
    toInt: true,
    optional: true,
  },
  arrearsOrPenaltiesPaid: {
    in: ['body'],
    isInt: true,
    toInt: true,
    optional: true,
  },
  meta: {
    in: ['body'],
    isString: true,
    optional: true,
  },
};

module.exports = {
  getTenantListingSchema,
  addNewTenantSchema,
  updateTenantSchema,
  uploadMediaSchema,
  getByIdSchema,
  deleteByIdSchema,
  generateSlipSchema,
};
