const express = require('express');
const AuthController = require('../controllers/authController');

const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/empresa/register', AuthController.registerEmpresaUser);
router.post('/empresa/login', AuthController.loginEmpresaUser);
router.get('/me', authenticateToken, AuthController.me);

module.exports = router;
