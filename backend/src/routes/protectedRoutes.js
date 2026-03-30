const express = require('express');
const ProtectedController = require('../controllers/protectedController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/dashboard', authenticateToken, ProtectedController.dashboard);
router.get('/admin', authenticateToken, authorizeRole('admin'), ProtectedController.adminOnly);

module.exports = router;
