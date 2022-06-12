const { StatusCodes } = require('http-status-codes');
const { USER_ROLES } = require('../../constants/userRoles');
const { authorizedUser } = require('../../helpers/authorization');
const models = require('../../models');

const _getUserListing = async (req, res, next) => {
  try {
    authorizedUser(req, USER_ROLES.ADMIN);
    const users = await models.User.findAll();

    res.status(StatusCodes.OK).json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  GetUserListing: _getUserListing,
};
