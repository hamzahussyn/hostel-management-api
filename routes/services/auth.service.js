const jwt = require('jsonwebtoken');
const models = require('../../models');
const { StatusCodes } = require('http-status-codes');

const { ErrorHandler, resolveSchemaValidationResult } = require('../../helpers/errorHandler');
const { createRefreshToken, createToken } = require('../../helpers/token');
const { checkHash } = require('../../helpers/security');
const { authorizedUser } = require('../../helpers/authorization');
const { USER_ROLES } = require('../../constants/userRoles');
require('dotenv').config();

const _register = async (req, res, next) => {
  try {
    // resolveSchemaValidationResult(req);

    // check if email already exists
    const doesUserExist = await models.User.findOne({
      where: { email: req.body.email },
    });

    if (doesUserExist) {
      throw new ErrorHandler(StatusCodes.CONFLICT, `A user with email ${req.body.email} already exists`);
    }

    const userCreated = await models.User.create({
      email: req.body.email,
      password: req.body.password,
    });

    const token = createToken(userCreated.id);
    // store token in DB
    const newToken = await models.JwtToken.create({
      token,
      user_id: userCreated.id,
    });
    if (!newToken) {
      throw new ErrorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Couldn't create token");
    }

    const refreshToken = createRefreshToken();

    // store refresh token in DB
    const newRefreshToken = await models.JwtRefreshToken.create({
      token: refreshToken,
      user_id: userCreated.id,
    });

    if (!newRefreshToken) {
      throw new ErrorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Couldn't create refresh token");
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const decodedRefreshToken = await jwt.verify(refreshToken, process.env.JWT_SECRET);

    res.status(StatusCodes.CREATED).json({
      data: {
        type: 'user',
        id: userCreated.id,
        attributes: {
          email: userCreated.email,
          role: userCreated.role,
          created_at: userCreated.createdAt,
          updated_at: userCreated.updatedAt,
        },
      },
      included: [
        {
          type: 'token',
          attributes: {
            token,
            expiration: new Date(decodedToken.exp * 1000),
          },
        },
        {
          type: 'refresh_token',
          attributes: {
            token: refreshToken,
            expiration: new Date(decodedRefreshToken.exp * 1000),
          },
        },
      ],
    });
  } catch (err) {
    next(err);
  }
};

const _login = async (req, res, next) => {
  try {
    // resolveSchemaValidationResult(req);

    const user = await models.User.findOne({
      where: { email: req.body.email },
    });
    if (!user || !checkHash(req.body.password, user.salt, user.password)) {
      throw new ErrorHandler(StatusCodes.UNAUTHORIZED, 'Wrong email or password');
    }

    const token = createToken(user.id);
    // store token in DB
    const newToken = await models.JwtToken.create({
      token,
      user_id: user.id,
    });
    if (!newToken) {
      throw new ErrorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Couldn't create token");
    }

    const refreshToken = createRefreshToken();

    // store refresh token in DB
    const newRefreshToken = await models.JwtRefreshToken.create({
      token: refreshToken,
      user_id: user.id,
    });

    if (!newRefreshToken) {
      throw new ErrorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "Couldn't create refresh token");
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const decodedRefreshToken = await jwt.verify(refreshToken, process.env.JWT_SECRET);

    res.status(StatusCodes.OK).json({
      data: {
        type: 'user',
        id: user.id,
        attributes: {
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      },
      included: [
        {
          type: 'token',
          attributes: {
            token,
            expiration: new Date(decoded.exp * 1000),
          },
        },
        {
          type: 'refresh_token',
          attributes: {
            token: refreshToken,
            expiration: new Date(decodedRefreshToken.exp * 1000),
          },
        },
      ],
    });
  } catch (err) {
    next(err);
  }
};

const _refresh = async (req, res, next) => {
  try {
    const refreshToken = jwt.verify(req.body.refresh_token, process.env.JWT_SECRET);

    if (!refreshToken) {
      throw new ErrorHandler(StatusCodes.FORBIDDEN, 'Refresh token expired');
    }

    // get user by token
    const refreshTokenInDb = await models.JwtRefreshToken.findOne({
      where: {
        token: req.body.refresh_token,
      },
    });

    if (!refreshTokenInDb) {
      throw new ErrorHandler(StatusCodes.NOT_FOUND, "Refresh token doesn't exist");
    }

    const token = createToken(refreshTokenInDb.user_id);
    const newRefreshToken = createRefreshToken();

    // store new token
    await models.JwtToken.create({
      user_id: refreshTokenInDb.user_id,
      token,
    });

    // store new refresh token
    await models.JwtRefreshToken.create({
      user_id: refreshTokenInDb.user_id,
      token: newRefreshToken,
    });

    // delete old one
    await models.JwtRefreshToken.destroy({
      where: {
        id: refreshTokenInDb.id,
      },
    });

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const decodedRefreshToken = await jwt.verify(newRefreshToken, process.env.JWT_SECRET);

    res.status(StatusCodes.ACCEPTED).json({
      data: {
        type: 'token',
        attributes: {
          token,
          expiration: new Date(decoded.exp * 1000),
        },
      },
      included: {
        type: 'refresh_token',
        attributes: {
          token: newRefreshToken,
          expiration: new Date(decodedRefreshToken.exp * 1000),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

const _me = async (req, res, next) => {
  try {
    authorizedUser(req, [USER_ROLES.ADMIN, USER_ROLES.GUEST]);
    const user = await models.User.findByPk(req.userId);
    if (!user) {
      throw new ErrorHandler(StatusCodes.NOT_FOUND, `No user with id ${req.userId}`);
    }
    res.status(StatusCodes.OK).json({
      data: {
        email: user.email,
        firstname: user.firstname,
        id: user.id,
        lastname: user.lastname,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

const _updateUserPassword = async (req, res, next) => {
  try {
    // authorizedUser(req, USER_ROLES.ADMIN);
    const user = await models.User.findOne({ where: { email: req.body.email } });
    var updateBody = {
      password: req.body.password,
    };

    await models.User.update({ ...user.dataValues, ...updateBody }, { where: { id: user.id } });

    res.status(StatusCodes.OK).json({ message: 'User password updated successfully', loading: false });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  RegisterAuthService: _register,
  LoginAuthService: _login,
  RefreshTokenAuthService: _refresh,
  MeAuthService: _me,
  UpdatePasswordService: _updateUserPassword,
};
