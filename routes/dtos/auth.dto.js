const registerRequestSchema = {
  email: {
    in: ['body'],
    errorMessage: 'Email is required',
    isEmail: true,
    toLowerCase: true,
  },
  password: {
    in: ['body'],
    errorMessage: 'Password is required',
    isLength: {
      errorMessage: 'Passwords length must be greater and equal to 8',
      options: { min: 8 },
    },
  },
};

module.exports = {
  RegisterRequestSchema: registerRequestSchema,
  LoginRequestSchema: registerRequestSchema,
};
