const express = require('express');
const AdminController = require('../controllers/adminController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post(
  '/register-admin',
  authenticateToken,
  authorizeRole('ADMIN'),
  AdminController.registerAdmin
);

module.exports = router;
