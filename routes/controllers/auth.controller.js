const express = require('express');
const verifyToken = require('../../middlewares/verifyToken');
const { checkSchema } = require('express-validator');
const router = express.Router();

const {
  RegisterAuthService,
  LoginAuthService,
  MeAuthService,
  RefreshTokenAuthService,
  UpdatePasswordService,
  VerifyLinkService,
  GenerateOneTimeLinkService,
} = require('../services/auth.service');
const { RegisterRequestSchema, LoginRequestSchema } = require('../dtos/auth.dto');

router.post('/register', checkSchema(RegisterRequestSchema), RegisterAuthService);
router.post('/login', checkSchema(LoginRequestSchema), LoginAuthService);
router.post('/refresh', RefreshTokenAuthService);
router.get('/me', verifyToken, MeAuthService);
router.get('/forgot-password', GenerateOneTimeLinkService);
router.get('/verify-link', VerifyLinkService);
router.post('/reset-password', UpdatePasswordService);

module.exports = router;
