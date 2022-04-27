const express = require('express');
const verifyToken = require('../../middlewares/verifyToken');
const { checkSchema } = require('express-validator');
const router = express.Router();

const { RegisterAuthService, LoginAuthService, MeAuthService, RefreshTokenAuthService } = require('../services/auth.service');
const { RegisterRequestSchema, LoginRequestSchema } = require('../dtos/auth.dto');

router.post('/register', checkSchema(RegisterRequestSchema), RegisterAuthService);
router.post('/login', checkSchema(LoginRequestSchema), LoginAuthService);
router.post('/refresh', RefreshTokenAuthService);
router.get('/me', verifyToken, MeAuthService);

module.exports = router;
