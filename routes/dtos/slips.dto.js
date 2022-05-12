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

module.exports = {
  getSlipsListingSchema
}